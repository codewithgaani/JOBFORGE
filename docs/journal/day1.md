# Day 1 - Project Setup

## Goal
Set up project structure and initialize Node.js project.

## What I Built
- Created project folders
- Initialized Git repository
- Added package.json
- Installed dependencies
- Added README and .gitignore

## Concepts Learned

### Separation of Concerns
Each folder has a single responsibility.

- api/ -> REST endpoints
- queue/ -> Redis queue logic
- workers/ -> background processing
- models/ -> database operations

### Why Git?
Git tracks changes and allows reverting to previous versions.

## Interview Notes

Q: Why separate code into folders?

A: To improve maintainability and allow independent scaling of different components.

## Commands Used

git init
npm init -y
npm install


## Key Takeaway

A good project structure makes large applications easier to maintain.