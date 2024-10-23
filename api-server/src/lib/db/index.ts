import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { redis } from '../redis';

export async function saveToDB(ideName: string, containerIP: string) {
    try {
        await prisma.iDE.create({
            data: {
                ideName,
                containerIP,
            },
        })
        await redis.set(ideName, containerIP);
        return true;
    } catch (err) {
        console.log("error db", err);
        return false;
    }
}