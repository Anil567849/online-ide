import express, {Request, Response} from "express";
const app = express();
const PORT = 9001;
import httpProxy from 'http-proxy';
import http, { ServerResponse } from 'http';

const server = http.createServer(app);

const proxyServer = httpProxy.createServer();

// WebSockets start as an HTTP request and then "upgrade" the connection from HTTP to a WebSocket. The
server.on("upgrade", (req, socket, head) => {
    const hostname = req.headers.host;
    if (!hostname) {
        socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
        socket.destroy();
        return;
    }

    const { ipAddress, defaultPort } = { ipAddress: '172.17.0.3', defaultPort: 8000 }
    const reverseProxyUrl = `http://${ipAddress}:${defaultPort}`;

    console.log(`Forwarding to ws proxy: ${reverseProxyUrl}`);

    // Forward the WebSocket upgrade request
    return proxyServer.ws(req, socket, head, { target: reverseProxyUrl, ws: true });
});

app.use((req: Request, res: Response) => {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    console.log('Full URL:', fullUrl);
    const endPath = fullUrl.split("/").pop();

    // get ipadress and port of the docker container of endPath 
    // const { ipAddress, defaultPort } = db.get(endPath);
    const { ipAddress, defaultPort } = { ipAddress: '172.17.0.3', defaultPort: 8000 }
    const reverseProxyUrl = `http://${ipAddress}:${defaultPort}`;

    console.log(`Forwarding to proxy: ${reverseProxyUrl}`);

    return proxyServer.web(req, res, { target: reverseProxyUrl, changeOrigin: true, ws: true });
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
    } else{
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