import express, { Request, Response } from 'express';
const app = express();
const PORT: number = 8000;
// @ts-ignore
import * as pty from 'node-pty';
import { Socket } from 'socket.io';
import http from 'http';
import cors from 'cors';
import fs from 'node:fs/promises'
import path from 'path'
import chokidar from 'chokidar';
import { IoManager } from './lib/services/socket';

export const server = http.createServer(app);

const io = IoManager.getIo();

app.use(cors());

chokidar.watch('./user').on('all', (event, path) => {
    io.emit('file:refresh', path)
});

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

app.get('/files', async (req: Request, res: Response) => {
    try {
        const fileTree = await generateFileTree('./user');
        res.json({ tree: fileTree })
    } catch (error) {
        res.status(404).json({result: 'error'})
    }
})

app.get('/files/content', async (req: Request, res: Response) => {
    try {
        const path = req.query.path;
        const content = await fs.readFile(`./user${path}`, 'utf-8')
        res.json({ content })
    } catch (error) {
        res.status(404).json({result: 'error'})
    }
})

server.listen(PORT, () => console.log('server on port:', PORT))

async function generateFileTree(directory: any) {
    const tree = {}

    async function buildTree(currentDir: any, currentTree: any) {
        const files = await fs.readdir(currentDir)

        for (const file of files) {
            const filePath = path.join(currentDir, file)
            const stat = await fs.stat(filePath)

            if (stat.isDirectory()) {
                currentTree[file] = {}
                await buildTree(filePath, currentTree[file])
            } else {
                currentTree[file] = null
            }
        }
    }

    await buildTree(directory, tree);
    return tree
}