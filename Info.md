# Info.md

## Docker файлы

### docker/Dockerfile.test

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Копируем package files
COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install --frozen-lockfile

# Копируем весь код
COPY . .

# Команда по умолчанию - запуск тестов
CMD ["yarn", "test"]
```

### docker/docker-compose.dev.yml

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "${DB_PORT}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ../../scripts/db/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres_data:
    driver: local
```

### docker/docker-compose.test.yml

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: test-db
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "5433:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 5s
      timeout: 3s
      retries: 10
    networks:
      - test-network

  test:
    build:
      context: ../..
      dockerfile: docker/Dockerfile.test
    container_name: test-runner
    depends_on:
      db:
        condition: service_healthy
    environment:
      - DB_HOST=db
      - DB_PORT=5432
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - NODE_ENV=test
      - PORT=3000
    volumes:
      - ../../src:/app/src:ro
      - ../../scripts:/app/scripts:ro
      - ../../vitest.config.js:/app/vitest.config.js:ro
    networks:
      - test-network
    command: sh -c "node scripts/db/init.js && yarn test"

networks:
  test-network:
    driver: bridge
```

## YAML файлы

### .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches:
      - "**" # запуск на любые ветки
  pull_request:
    branches:
      - master
      - main

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Create .env file for tests
        run: |
          echo "DB_HOST=db" >> .env
          echo "DB_PORT=5432" >> .env
          echo "DB_USER=postgres" >> .env
          echo "DB_PASSWORD=postgres" >> .env
          echo "DB_NAME=test_db" >> .env
          echo "PORT=3000" >> .env

      - name: Start database and run tests
        run: |
          docker-compose -f docker/docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from test

      - name: Cleanup
        if: always()
        run: |
          docker-compose -f docker/docker-compose.test.yml down -v
```

### .github/workflows/deploy.yml

```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Yarn
        run: npm install -g yarn

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Create .env file for tests
        run: echo "PORT=${{ secrets.PORT }}" > .env

      - name: Run tests
        run: yarn test

      - name: Clean backend directory
        uses: appleboy/ssh-action@v1.1.0
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          password: ${{ secrets.SSH_PASSWORD }}
          script: |
            rm -rf ${{ secrets.SSH_PATH }}/*

      - name: Upload backend files
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          password: ${{ secrets.SSH_PASSWORD }}
          source: .
          target: ${{ secrets.SSH_PATH }}
          debug: true

      - name: Create .env file on server
        uses: appleboy/ssh-action@v1.1.0
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          password: ${{ secrets.SSH_PASSWORD }}
          script: |
            echo "PORT=${{ secrets.PORT }}" > ${{ secrets.SSH_PATH }}/.env

      - name: Install deps & restart backend
        uses: appleboy/ssh-action@v1.1.0
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          password: ${{ secrets.SSH_PASSWORD }}
          script: |
            cd ${{ secrets.SSH_PATH }}
            yarn install --production --frozen-lockfile
            pm2 reload fastify-backend || pm2 start src/server.js --name fastify-backend
```

## package.json

### package.json

```json
{
  "name": "simple-backend",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev": "nodemon src/server.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "db:start": "docker-compose -f docker/docker-compose.dev.yml up -d",
    "db:stop": "docker-compose -f docker/docker-compose.dev.yml down",
    "db:init": "node scripts/db/init.js",
    "db:seed": "node scripts/db/seed.js",
    "db:clear": "node scripts/db/clear.js",
    "db:reset": "node scripts/db/clear.js && node scripts/db/seed.js"
  },
  "repository": "https://github.com/mister-asia/simple-backend.git",
  "author": "Александр Алиновский <aalinovskiy@alfabank.ru>",
  "license": "MIT",
  "dependencies": {
    "dotenv": "^17.2.3",
    "fastify": "^4.25.2",
    "pg": "^8.11.3"
  },
  "devDependencies": {
    "@vitest/ui": "^4.0.16",
    "nodemon": "^3.1.0",
    "vitest": "^4.0.16"
  }
}
```
