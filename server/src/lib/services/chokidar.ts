
import chokidar from 'chokidar';
import { IoManager } from './socket';
const io = IoManager.getIo();

export function initChokidar() {
    chokidar.watch('./user').on('all', (event, path) => {
        io.emit('file:refresh', path)
    });
}