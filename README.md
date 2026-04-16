# Game System – Node.js Backend
           Getting Started

 1. Clone the repository
```bash
git clone [https://github.com/racheli-gratsh/game-system.git](https://github.com/racheli-gratsh/game-system.git)
cd game-system 
## Tech Stack
- **Runtime**: Node.js 20
- **ORM**: Prisma
- **Database**: PostgreSQL 16
- **Container**: Docker + Docker Compose

---

## Project Structure

```
game-system/
├── prisma/
│   └── schema.prisma          # Data models & relations
├── src/
│   ├── errors/
│   │   └── index.js           # Custom error classes
│   ├── repositories/
│   │   └── game.repository.js # All DB queries (data layer)
│   ├── services/
│   │   └── game.service.js    # Business logic
│   └── logger.js              # Timestamped logger
├── main.js                    # Entry point
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

## Run with Docker (Plug & Play)

```bash
docker compose up --build
```

This single command will:
1. Start PostgreSQL and wait until it is healthy
2. Run Prisma migrations automatically
3. Execute `main.js`
4. Print the success (or error) message in the logs

---

## Run Locally (without Docker)

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your DB URL
cp .env.example .env

# 3. Run migrations
npx prisma migrate dev --name init

# 4. Run the entry point
node main.js
```

---

## Architecture Decisions

| Decision | Reason |
|---|---|
| Repository pattern | Separates DB queries from business logic |
| Custom Error classes | Clear, typed errors; easy to extend |
| Prisma transaction | Atomic write — all-or-nothing safety |
| Docker healthcheck | App never starts before DB is truly ready |
| Layered structure | Clean, testable, and scalable |
