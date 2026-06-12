import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// A pool keeps multiple connections open
// Instead of opening a new connection per query (slow),
// requests borrow a connection from the pool (fast)
const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'jobforge',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 10,                    // max 10 simultaneous connections
  idleTimeoutMillis: 30000,   // close idle connections after 30s
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL pool error:', err.message);
});

// Test connection on startup
const testClient = await pool.connect();
console.log('✓  PostgreSQL connected');
testClient.release();

export default pool;