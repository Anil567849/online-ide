import { Server } from "socket.io";
import { server } from "../../index";

export class IoManager {
    private static io: Server;

    // singleton pattern
    public static getIo() {
        if (!this.io) {
            const io = new Server(server, {
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