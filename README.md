# Learning Copilot
Personal knowledge base with AI assistant. It allows you to preserve links and documents by converting them into structured knowledge using vector search.

## Technologies
* **Backend:** NestJS (TypeScript)
* **Database:** PostgreSQL + pgvector
* **Cache:** Redis
* **DevOps:** Docker, Docker-compose
* **ORM:** TypeORM

## How to Run
1. **clone the repository**
```bash 
git clone git@github.com:DN0p/learning-copilot.git
```
2. **Setup environment variables**
```bash 
cp .env.example .env
```
3. **Start the project using Docker**
```bash 
docker-compose up --build
```