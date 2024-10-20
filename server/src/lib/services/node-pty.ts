// @ts-ignore
import * as pty from 'node-pty';
import { IoManager } from './socket';

export function initPty(){
    const io = IoManager.getIo();
    const ptyProcess = pty.spawn('bash', [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.env.INIT_CWD + '/user',
        env: process.env
    });
    
    ptyProcess.onData((data: string) => {
        io.emit('terminal:data', data)
    })

    return ptyProcess;
}

