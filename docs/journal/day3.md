# Day 3 — Redis Connection

## What I built

- Redis connection module at src/config/redis.js
- Automatic reconnect logic if Redis goes down
- /health endpoint now also verifies Redis is alive

## Why Redis AND PostgreSQL — the key mental model

Redis = whiteboard (fast, in-memory, workers erase as they go)
PostgreSQL = filing cabinet (permanent, disk-based, never loses data)

Redis is ~10x faster for queue operations but loses data on restart.
PostgreSQL is permanent but too slow to be a queue.
Each does what it's best at.

## Architecture After Today

Client
↓
Express API
↓
Redis

## Key concepts

**In-memory store** — Redis holds everything in RAM. Fast because
no disk I/O. If Redis restarts, queue data is gone — that's fine
because PostgreSQL has the permanent record.

**reconnectStrategy** — if Redis goes down temporarily, the client
retries after 500ms, 1000ms, 1500ms instead of crashing the server.
Retries more than 3 times → throws error.

**Single connection module** — if I wrote createClient() in every
file, I'd have 10 connections. One module, one connection, imported
everywhere. Cleaner and safer.

**Top-level await** — because package.json has "type":"module",
await can be used outside async functions. The module won't finish
loading until Redis is fully connected.

**Event emitters** — client.on('connect'), client.on('error') react
to Redis connection state changes automatically.

## Interview answer

"Redis is the queue backbone — API pushes jobs in, workers pop
them out. I abstracted the connection into a single config module
with reconnect logic so temporary Redis blips don't crash the server.
The health endpoint pings Redis independently so monitoring tools
can detect queue layer failures separately from HTTP failures."

## Commands

```bash
redis-cli ping              # PONG = Redis is running
npm run dev                 # should see ✓ Redis connected
curl localhost:3000/health  # should see "redis":"connected"
git add . && git commit -m "Day 3: Redis connection module"
```

## Challenges Faced
## Challenge 1: WSL Installation

Issue:
Redis requires Linux support for best compatibility.

Solution:
Installed Ubuntu using WSL2.

Learning:
Many backend tools are Linux-first.

## Challenge 2: Node Version Conflict

Issue:
Windows Node.js and WSL Node.js conflicted.

Solution:

nvm install 22

nvm use 22

Learning:
Use NVM to manage Node versions cleanly.

## Challenge 3: Permission Error

Issue:

EACCES permission denied

Solution:

sudo chown -R $USER:$USER ~/jobforge

Learning:
File ownership matters in Linux.

Commands Learned

redis-cli ping

Purpose:
Check Redis connectivity.

which node

Purpose:
Verify active Node.js installation.

npm run dev

Purpose:
Start the application.

## SELF NOTES
"Redis is an in-memory data store — extremely fast for queue operations. I abstracted the connection into a single config module with automatic reconnection logic. The health endpoint pings Redis on every request so a load balancer can detect if the queue layer goes down, not just the HTTP server."