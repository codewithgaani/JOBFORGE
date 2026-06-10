# Day 2: Express Server & Health Check

## Goal of the Day

Build the first backend service for JobForge using Express.js and expose a health-check endpoint.

---

## What I Built

- Express.js server
- Port configuration
- Health-check endpoint (`GET /health`)
- JSON response handling
- Server startup logging

---

## Why We Need This

Every request in JobForge will enter through the Express API.

Future flow:

Client
↓
Express API
↓
Redis Queue
↓
Workers
↓
PostgreSQL

Without the API layer, users cannot submit jobs or view job status.

---

## Architecture Before Today

Client

(No backend service)

---

## Architecture After Today

Client
↓
Express API

---

## Concepts Learned

### Node.js

Node.js is a JavaScript runtime that allows JavaScript to run outside the browser.

Why JobForge uses it:

- Fast development
- Large ecosystem
- Good for APIs and distributed systems

---

### Express.js

Express is a web framework built on top of Node.js.

Benefits:

- Easy routing
- Middleware support
- Cleaner code structure

---

### API

API stands for Application Programming Interface.

Purpose:
Allows frontend and backend systems to communicate.

Example:

GET /health

POST /jobs

GET /jobs

---

### Route

A route is an endpoint handled by the server.

Examples:

GET /health

POST /jobs

---

### Health Check Endpoint

A route that verifies whether a service is running.

Example:

GET /health

Response:

{
"status": "ok"
}

---

### Commands I ran
```bash
npm run dev
curl http://localhost:3000/health
curl http://localhost:3000/anythingrandom
git add . && git commit -m "Day 2: Express server with health check"
```

## Challenges Faced

### Challenge 1: Moving Development to WSL

Issue:
Needed a Linux environment for Redis and backend development.

Solution:
Installed WSL2 and Ubuntu.

Learning:
Backend development is often easier in Linux environments.

---

### Challenge 2: Understanding Project Structure

Issue:
Confusion about where files should live.

Solution:
Organized code into:

- api/
- config/
- queue/
- workers/
- models/

Learning:
Separation of concerns improves maintainability.

---


##  Questions

Q: Why use Express?

A:
Express simplifies routing, middleware, request handling, and API development.

---

Q: Why not use Node's built-in HTTP module?

A:
Express provides cleaner APIs and reduces boilerplate code.

---

Q: What is a health-check endpoint?

A:
A route used by monitoring systems and load balancers to verify that a service is operational.

---

Q: What is a REST API?

A:
An API that follows REST principles and uses HTTP methods like GET, POST, PUT, and DELETE.

---

## What Would Break If This Failed?

If the API server fails:

- Users cannot submit jobs.
- Users cannot view job status.
- Monitoring systems report service failure.

---


## Resume Points Gained

- Built REST APIs using Express.js.
- Designed service health monitoring endpoints.

---

## Key Takeaways

- Learned Express fundamentals.
- Learned routing and API design.
- Built the entry point of JobForge.
- Understood health-check endpoints.

## SELF NOTES 
"The server uses Express with dotenv to load environment-specific config at startup. I added a /health endpoint that returns service status and uptime — this is what a load balancer pings before routing traffic to the instance. I also added a catch-all 404 handler so unknown routes return a clean JSON error instead of crashing."