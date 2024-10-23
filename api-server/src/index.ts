import express, { Request, Response } from 'express';
import cors from 'cors'
import { spinAContainer } from './lib/aws/aws';
import { saveToDB } from './lib/db';
import { getRandomSlug } from './lib/utils';
const app = express();
const PORT = 9000;
import './lib/redis/index';

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173"
}))

app.post('/api/create-ide', async (req: Request, res: Response) => {
    const {data: ideName} = req.body;   
    try {
        const slug = getRandomSlug();
        const {containerIP} = await spinAContainer();
        const saved = await saveToDB(`${ideName}_${slug}`, containerIP);
        if(saved){
            res.status(200).json({subdomain: `${ideName}_${slug}`});
        }
    } catch (error) {
        res.status(500).json({error: "something went wrong"});
    }
})

app.listen(PORT, () => console.log('listening on port:', PORT))
