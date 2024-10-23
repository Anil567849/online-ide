import Redis from 'ioredis';
export const redis = new Redis({
    port: 16801, // Redis port
    host: "", // Redis host
    username: "default", // needs Redis >= 6
    password: "",
});