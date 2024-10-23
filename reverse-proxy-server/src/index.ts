import express, { NextFunction, Request, Response } from "express";
const app = express();
const PORT = 9001;
import cors from 'cors';
import httpProxy from 'http-proxy';
import http, { ServerResponse } from 'http';
import { redis } from './lib/redis/index';

const server = http.createServer(app);

const proxyServer = httpProxy.createServer();

const corsOptions = {
    origin: "http://localhost:5173",
    allowedHeaders: ["x-ide-id", "Content-Type"],
};

app.use(cors(corsOptions))

let containerIP: string | null = "";

// WebSockets start as an HTTP request and then "upgrade" the connection from HTTP to a WebSocket. The
server.on("upgrade", async (req, socket, head) => {
    const hostname = req.headers.host;

    if (!hostname) {
        socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
        socket.destroy();
        return;
    }

    try {
        const { ipAddress, defaultPort } = { ipAddress: containerIP, defaultPort: 8000 }
        const reverseProxyUrl = `http://${ipAddress}:${defaultPort}`;

        console.log(`Forwarding to ws proxy: ${reverseProxyUrl}`);

        return proxyServer.ws(req, socket, head, { target: reverseProxyUrl, ws: true });
    } catch (error) {
        socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
        socket.destroy();
        return;
    }
});

app.use(async (req: Request, res: Response) => {
    // const requestingToURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    // console.log("requestingToURL::::", requestingToURL);

    const ideId = req.get('x-ide-id'); // or req.headers['x-ide-id']

    try {
        if(ideId){
            containerIP = await redis.get(ideId);
        }       

        const { ipAddress, defaultPort } = { ipAddress: containerIP, defaultPort: 8000 }
        const reverseProxyUrl = `http://${ipAddress}:${defaultPort}`;

        console.log(`Forwarding to proxy: ${reverseProxyUrl}`);
        return proxyServer.web(req, res, { target: reverseProxyUrl, changeOrigin: true, ws: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
})

proxyServer.on("error", (err, req, res) => {
    console.error("Proxy server error:", err);

    if (res instanceof ServerResponse) {
        // Only check headersSent if it's a ServerResponse
        if (!res.headersSent) {
            res.writeHead(502, {
                'Content-Type': 'text/plain'
            });
            res.end("Bad Gateway: Unable to connect to target service.");
        }
    } else {
        // If it's a Socket, simply destroy the socket
        res.destroy();
    }
});

// Retry logic in case of connection reset or refused
proxyServer.on("econnreset", (err, req, res) => {
    console.log("Connection reset by peer:", err);
    if (res && !res.headersSent) {
        res.writeHead(504, {
            'Content-Type': 'text/plain'
        });
        res.end("Gateway Timeout: Target service did not respond.");
    }
});

server.listen(PORT, () => console.log("R Proxy Server:", PORT))