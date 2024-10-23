import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export default function initSocket(ideId: string): Socket {
    // Only initialize socket once
    if (!socket) {
        socket = io('http://localhost:9001');

        // Handle connection event
        socket.on('connect', () => {
            console.log(`Connected to server with ideId: ${ideId}`);
        });
    }

    return socket;
}