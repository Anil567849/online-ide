import express, { NextFunction, Request, Response } from "express";
const app = express();
const PORT = 9001;
import cors from 'cors';
import httpProxy from 'http-proxy';
import http, { ServerResponse } from 'http';
import { redis } from './lib/redis/index';

const server = http.createServer(app);

const proxyServer = httpProxy.createServer();

// const corsOptions = {
//     origin: "http://localhost:5173",
//     allowedHeaders: ["x-ide-id", "Content-Type"],
// };

// app.use(cors(corsOptions))

// WebSockets start as an HTTP request and then "upgrade" the connection from HTTP to a WebSocket. The
server.on("upgrade", async (req, socket, head) => {
    const hostname = req.headers.host;
    // console.log('REQ URL::::', req.url);
    
    // if (!req.url) return;

    // Parse the URL to get query parameters
    // const url = new URL(req.url, `http://${hostname}`);
    // const ideId = url.searchParams.get('x-ide-id');
    // console.log("IDE ID::::", ideId);
    

    if (!hostname) {
        socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
        socket.destroy();
        return;
    }
    // try {
        // const containerIP = await redis.get(ideId);
        const containerIP = '172.17.0.3'

        const { ipAddress, defaultPort } = { ipAddress: containerIP, defaultPort: 8000 }
        const reverseProxyUrl = `http://${ipAddress}:${defaultPort}`;

        console.log(`Forwarding to ws proxy: ${reverseProxyUrl}`);

        return proxyServer.ws(req, socket, head, { target: reverseProxyUrl, ws: true });
    // } catch (error) {
    //     console.log("Error: middleware", error);
    //     return;
    // }
});

app.use(async (req: Request, res: Response) => {

    // const ideId = req.get('x-ide-id'); // or req.headers['x-ide-id']
    // if (!ideId) {
    //     res.send({ error: "ideId is required" });
    //     return;
    // }

    try {
        // const containerIP = await redis.get(ideId);
        const containerIP ='172.17.0.3';
        const requestingToURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        console.log("requestingToURL::::", requestingToURL);

        const { ipAddress, defaultPort } = { ipAddress: containerIP, defaultPort: 8000 }
        const reverseProxyUrl = `http://${ipAddress}:${defaultPort}`;

        console.log(`Forwarding to proxy 1: ${reverseProxyUrl}`);
        return proxyServer.web(req, res, { target: reverseProxyUrl, changeOrigin: true, ws: true });
    } catch (error) {
        console.log("Error: middleware", error);
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