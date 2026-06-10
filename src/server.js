import express from 'express';
import dotenv from 'dotenv';
import redisClient from './config/redis.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check — now also verifies Redis is alive
app.get('/health', async (req, res) => {
  const redisPing = await redisClient.ping();

  res.json({
    status: 'ok',
    service: 'JobForge API',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    redis: redisPing === 'PONG' ? 'connected' : 'disconnected'
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

app.listen(PORT, () => {
  console.log(`\nJobForge API running on http://localhost:${PORT}`);
  console.log(`Health check:  http://localhost:${PORT}/health\n`);
});

export default app;