import express from 'express';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────
// Parses incoming JSON request bodies
app.use(express.json());

// ── Routes ───────────────────────────────────────────────
// Health check — load balancers and monitors ping this
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'JobForge API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler — catches any route that doesn't exist
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// ── Start server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`JobForge API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;