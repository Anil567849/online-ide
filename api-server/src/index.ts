import express, { Request, Response } from 'express';
import cors from 'cors'
import { spinAContainer } from './lib/aws/aws';
const app = express();
const PORT = 9000;

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173"
}))

app.post('/api/create-ide', async (req: Request, res: Response) => {
    const {data: ideName} = req.body;   
    try {
        // await spinAContainer();
        res.status(200).json({subdomain: ideName + "anilanilanialnail"});
    } catch (error) {
        res.status(500).json({error: "something went wrong"});
    }
    
})

app.listen(PORT, () => console.log('listening on port:', PORT))
