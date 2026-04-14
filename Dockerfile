FROM node:20-bullseye-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node main.js"]