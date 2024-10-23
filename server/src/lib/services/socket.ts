import { Server, Socket } from "socket.io";
import { server as httpServer } from "../../index";
import fs from 'node:fs/promises'
import { initPty } from "./node-pty";

export class IoManager {
    private static io: Server;

    // singleton pattern
    public static getIo() {
        if (!this.io) {
            const io = new Server(httpServer, {
                cors: {
                    allowedHeaders: "*",
                    origin: "http://localhost:5173"
                }
            });
            this.io = io;
        }
        return this.io;
    }

}

export function initSocket() {
    const io = IoManager.getIo();
    const ptyProcess = initPty();

    io.on('connection', (socket: Socket) => {
        console.log('socket connected', socket.id);

        socket.emit('file:refresh')

        socket.on('file:change', async ({ path, content }) => {
            try {
                await fs.writeFile(`/home/app/user${path}`, content)
            } catch (error) {
                console.log('error while writing file', error);
            }

        })

        socket.on('terminal:write', (data) => {
            ptyProcess.write(data);
        })
    })
}