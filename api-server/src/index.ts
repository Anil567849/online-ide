import express, { Request, Response } from 'express';
import cors from 'cors'
const app = express();
const PORT = 9000;

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173"
}))

app.post('/api/create-ide', (req: Request, res: Response) => {
    const {data: ideName} = req.body;   
    res.status(200).json({subdomain: ideName + "anilanilanialnail"});
})


app.listen(PORT, () => console.log('listening on port:', PORT))
