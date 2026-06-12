import { createClient } from 'redis';

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,

    reconnectStrategy: (retries) => {
      if (retries > 3) {
        console.error('Redis: max reconnect attempts reached');
        return new Error('Too many retries');
      }
      return retries * 500;
    }
  }
});

client.on('error',        (err) => console.error('❌ Redis error:', err.message));
client.on('connect',      ()    => console.log('✓  Redis connected'));
client.on('reconnecting', ()    => console.log('⟳  Redis reconnecting...'));

await client.connect();

export default client;