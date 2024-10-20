import express, { Request, Response } from 'express';
const app = express();
import http from 'http';
export const server = http.createServer(app);

import cors from 'cors';
import fs from 'node:fs/promises'
import { initSocket } from './lib/services/socket';
import { initChokidar } from './lib/services/chokidar';
import { generateFileTree } from './lib/utils';
const PORT: number = 8000;

app.use(cors());

initSocket();
initChokidar();

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
