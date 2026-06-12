# Day 4: PostgreSQL Integration & Jobs Schema Design

## Goal of the Day

Introduce persistent storage into JobForge using PostgreSQL and design the jobs table that will store every job's lifecycle.

---

## What I Built

- Installed PostgreSQL on Ubuntu (WSL)
- Created the `jobforge` database
- Configured PostgreSQL authentication
- Created a PostgreSQL connection pool
- Designed the `jobs` table schema
- Created database indexes
- Built a migration system
- Added PostgreSQL checks to the health endpoint

---

## Why We Need This

Redis is fast but temporary.

If Redis restarts, queued data can disappear.

PostgreSQL acts as the permanent source of truth.

Job lifecycle:

Client
↓
API
↓
PostgreSQL (Store Job Record)
↓
Redis (Queue Job)
↓
Worker
↓
PostgreSQL (Update Status)

---

## Architecture Before Today

Client
↓
Express API
↓
Redis

---

## Architecture After Today

Client
│
▼
Express API
│
├── Redis
│ Queue Layer
│
└── PostgreSQL
Persistent Storage

---

## Concepts Learned

### PostgreSQL

PostgreSQL is a relational database used for persistent storage.

Benefits:

- ACID compliance
- Reliable transactions
- Powerful querying
- Production-grade scalability

---

### Connection Pooling

Instead of opening a new database connection for every request:

Request
↓
Open Connection
↓
Query
↓
Close Connection

We maintain a pool:

Pool (10 Connections)
↓
Borrow Connection
↓
Run Query
↓
Return Connection

Benefits:

- Faster performance
- Lower overhead
- Better scalability

---

### Database Migration

A migration is a controlled way to create or modify database structures.

Purpose:

- Consistent schema across environments
- Easy deployment
- Version-controlled database changes

---

### UUID

Each job receives a UUID.

Example:

550e8400-e29b-41d4-a716-446655440000

Why not auto-increment IDs?

Because UUIDs work well in distributed systems and avoid collisions.

---

### JSONB

Stores flexible job data.

EMAIL Job:

```json
{
  "to": "abc@gmail.com"
}
```

REPORT Job:

```json
{
  "reportId": 42
}
```

Why JSONB?

Different job types need different payload structures.

---

## Jobs Table Design

### id

Unique identifier for every job.

Purpose:
Track jobs across the system.

---

### type

Defines job category.

Examples:

- EMAIL
- REPORT
- NOTIFICATION

---

### payload

Stores job-specific data.

Type:
JSONB

---

### status

Tracks current state.

Possible values:

- PENDING
- ACTIVE
- DONE
- FAILED

---

### priority

Determines execution order.

Values:

- HIGH
- MEDIUM
- LOW

---

### attempts

Tracks retry count.

---

### max_attempts

Maximum allowed retries.

---

### created_at

Job creation timestamp.

---

### updated_at

Last update timestamp.

---

### scheduled_for

Future execution time.

Used later for delayed jobs.

---

### completed_at

Completion timestamp.

NULL until finished.

---

## Why Indexes Were Added

### idx_jobs_status_priority

Purpose:

Workers frequently search:

"Give me the next pending job."

Without an index:
Database scans the entire table.

With an index:
Fast lookup.

---

### idx_jobs_type

Purpose:

Dashboard queries:

"Show all EMAIL jobs."

---

## Code Walkthrough

### db.js

Purpose:
Create and manage PostgreSQL connections.

Key concept:
Connection pooling.

---

### schema.sql

Purpose:
Define database structure.

Contains:

- jobs table
- UUID generation
- indexes

---

### migrate.js

Purpose:
Execute schema.sql against PostgreSQL.

Flow:

Read SQL File
↓
Connect to Database
↓
Run Queries
↓
Create Schema

---

### Health Endpoint Update

Added:

```sql
SELECT 1
```

Purpose:

Verify PostgreSQL connectivity.

Health endpoint now checks:

- API
- Redis
- PostgreSQL

---

## Challenges Faced

### Challenge 1: Multiple Project Copies

Issue:

Two different JobForge projects existed.

Windows:

C:\Users\bhatt\JOBFORGE

Linux:

/home/bhatt/jobforge

Result:

Files were created in the wrong project.

Solution:

Moved development completely to the Linux project.

Learning:

Always verify project location with:

```bash
pwd
```

---

### Challenge 2: PostgreSQL Authentication Failure

Issue:

```text
password authentication failed
```

Root Cause:

`.env` still contained:

DB_PASSWORD=yourpassword

while PostgreSQL expected:

DB_PASSWORD=jobforge_dev_2026

Solution:

Updated `.env`.

Learning:

Always verify environment variables during debugging.

---

### Challenge 3: Migration File Not Found

Issue:

```text
Cannot find module migrate.js
```

Root Cause:

Files were missing from Linux project.

Solution:

Created files in correct project location.

Learning:

Verify filesystem paths before debugging code.

---

## Commands Learned

Install PostgreSQL:

```bash
sudo apt-get install postgresql postgresql-contrib -y
```

Start PostgreSQL:

```bash
sudo service postgresql start
```

Open PostgreSQL shell:

```bash
sudo -u postgres psql
```

Run migration:

```bash
node src/config/migrate.js
```

Verify table:

```sql
\d jobs
```

Test health endpoint:

```bash
curl http://localhost:3000/health
```

---

## Interview Questions

### Why use PostgreSQL if Redis already exists?

Redis handles temporary queue operations.

PostgreSQL stores permanent job history.

---

### Why use JSONB?

Different job types require different payload structures.

JSONB provides flexibility without schema changes.

---

### Why use UUID instead of auto-increment IDs?

UUIDs are globally unique and work better in distributed systems.

---

### What is a connection pool?

A reusable collection of database connections that improves performance.

---

### Why add indexes?

Indexes speed up frequently executed queries.

---

## 30-Second Interview Explanation

Today I integrated PostgreSQL into JobForge as the persistent storage layer. I designed a jobs table capable of storing job metadata, retries, priorities, scheduling information, and payloads using JSONB. I also implemented a connection pool, database migrations, and extended the health endpoint to verify database connectivity.

---

## What Would Break If PostgreSQL Failed?

- Job history would be unavailable.
- Status tracking would stop.
- Dashboard queries would fail.
- Workers could process jobs but results would not be persisted.

## Resume Points Gained

- Integrated PostgreSQL with Node.js.
- Designed relational database schemas.
- Implemented database migrations.
- Built connection pooling for scalable backend services.
- Designed persistent job tracking architecture.

---

## self notes

"I used a connection pool instead of single connections — the pool keeps 10 connections open and requests borrow one instead of creating a new connection each time. For the schema, I used UUID primary keys instead of auto-increment because they're unique across distributed servers. I added a composite index on status, priority, and scheduled_for because that's exactly what workers query — give me the next PENDING job, highest priority first. Without the index that query would do a full table scan."
