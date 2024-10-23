
import crypto from 'crypto';

export function getRandomSlug(length = 10): string{
    return crypto.randomBytes(Math.ceil(length / 2)) // generate half the length in bytes
    .toString('hex') // convert to hexadecimal string
    .slice(0, length); // slice to the desired length
}