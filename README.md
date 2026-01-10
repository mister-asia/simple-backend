# simple-backend

Простой backend на Node.js с использованием Fastify и PostgreSQL.

> 🚀 **Быстрый старт:** см. [QUICKSTART.md](./QUICKSTART.md)  
> 📋 **Все команды:** см. [docs/COMMANDS.md](./docs/COMMANDS.md)

## Особенности архитектуры

### Singleton для подключения к БД

- Единственный экземпляр `Db` создается при старте приложения
- Метод `db.connect(config)` принимает конфигурацию и инициализирует подключение к PostgreSQL
- Все сервисы используют один и тот же пул соединений
- Конфигурация передается явно, что делает класс более гибким и тестируемым

### Dependency Injection

- Сервисы получают зависимость `db` через конструктор
- Легко тестировать с mock-объектами
- Явное управление зависимостями

### Пример использования

```javascript
// server.js
import { db } from "./db/Db.js";
import { config } from "./config/config.js";

// Подключаемся с конфигурацией
await db.connect(config.database);

// Передаем db в сервис через DI
const userService = new UserService(db);
```

## Установка и запуск

### 🐳 Разработка в Docker (рекомендуется)

**Запуск приложения и базы данных в Docker с hot-reload:**

```bash
# 1. Скопировать пример конфигурации
cp .env.example .env

# 2. Собрать и запустить всё (БД + приложение + инициализация + hot-reload)
yarn setup:dev
```

Приложение будет доступно на `http://localhost:3000` с автоматической перезагрузкой при изменении файлов.

**Что делает `yarn setup:dev`:**
- Запускает PostgreSQL в Docker
- Собирает Docker образ для разработки (с devDependencies)
- Монтирует исходный код для hot-reload
- Инициализирует базу данных
- Запускает приложение с `node --watch`

**Просмотр логов:**
```bash
yarn docker:dev:logs     # Логи приложения (разработка)
yarn docker:db:logs      # Логи базы данных
```

### 🚀 Production в Docker

**Запуск приложения в production-режиме:**

```bash
# 1. Скопировать пример конфигурации
cp .env.example .env

# 2. Собрать и запустить всё
yarn setup:docker
```

Приложение будет доступно на `http://localhost:3000` без hot-reload (production режим).

**Просмотр логов:**
```bash
yarn docker:logs          # Все сервисы
yarn docker:app:logs      # Только приложение
yarn docker:db:logs       # Только база данных
```

### Доступные команды Make

```bash
make help        # Показать все доступные команды
make db-up       # Запустить PostgreSQL в Docker
make db-down     # Остановить PostgreSQL
make db-logs     # Показать логи PostgreSQL
make db-reset    # Пересоздать базу данных
make db-init     # Создать таблицы
make db-seed     # Заполнить тестовыми данными
make db-clear    # Очистить таблицы
make dev         # Запустить сервер в режиме разработки
make start       # Запустить сервер
make test        # Запустить тесты
make setup       # Полная настройка (БД + таблицы + данные)
```

### Доступные npm скрипты

**Управление Docker:**

**Разработка:**
```bash
yarn docker:dev:build   # Собрать образ для разработки
yarn docker:dev:up      # Запустить в режиме разработки (hot-reload)
yarn docker:dev:down    # Остановить (разработка)
yarn docker:dev:logs    # Логи приложения (разработка)
yarn docker:dev:rebuild # Пересобрать и запустить (разработка)
```

**Production:**
```bash
yarn docker:build       # Собрать образ приложения
yarn docker:up          # Запустить все сервисы (БД + приложение)
yarn docker:down        # Остановить все сервисы
yarn docker:restart     # Перезапустить все сервисы
yarn docker:rebuild     # Пересобрать и запустить
yarn docker:reset       # Пересоздать всё с нуля (удалить данные)
yarn docker:logs        # Показать логи всех сервисов
yarn docker:app:logs    # Показать логи приложения
```

**База данных:**
```bash
yarn docker:db:up       # Запустить только БД
yarn docker:db:logs     # Логи базы данных
```

**Управление базой данных:**

```bash
yarn db:init        # Создать таблицы
yarn db:seed        # Заполнить тестовыми данными
yarn db:clear       # Очистить таблицы
yarn db:reset       # Очистить и заполнить заново
yarn db:setup       # init + seed (полная настройка БД)
```

**Запуск приложения:**

```bash
yarn start          # Запустить сервер локально
yarn dev            # Запустить локально в режиме разработки (с hot-reload)
yarn dev:docker     # Запустить в Docker в режиме разработки (с hot-reload)
```

**Тестирование:**

```bash
yarn test           # Запустить тесты
yarn test:watch     # Тесты в режиме watch
yarn test:coverage  # Тесты с coverage
yarn test:ui        # Тесты с UI интерфейсом
```

**Полная настройка одной командой:**

```bash
yarn setup:dev       # Разработка в Docker: БД + приложение + hot-reload
yarn setup:docker    # Production в Docker: БД + приложение (production режим)
```

## Структура проекта

```
src/
├── config/          # Конфигурация приложения
├── db/              # Работа с базой данных (Singleton)
├── routes/          # Маршруты API
├── services/        # Бизнес-логика
└── server.js        # Точка входа

scripts/
├── init.js          # Создание таблиц
├── seed.js          # Заполнение данными
└── clear.js         # Очистка таблиц
```

## API Endpoints

- `GET /users` - Получить всех пользователей
- `GET /users?page=1&limit=10` - Получить пользователей с пагинацией
- `GET /users/:id` - Получить пользователя по ID

## Docker

### PostgreSQL в Docker

Проект включает готовую конфигурацию Docker Compose для PostgreSQL:

**docker-compose.yml особенности:**

- PostgreSQL 16 Alpine (легковесный образ)
- Автоматическая инициализация через `init.sql`
- Persistent volume для данных
- Health check для проверки готовности
- Переменные окружения из `.env`

**Управление контейнером:**

```bash
# Запустить
docker-compose up -d

# Остановить
docker-compose down

# Остановить и удалить данные
docker-compose down -v

# Показать логи
docker-compose logs -f postgres

# Проверить статус
docker-compose ps
```

**Подключение к БД в контейнере:**

```bash
docker-compose exec postgres psql -U postgres -d simple_backend
```

## Переменные окружения

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Затем отредактируйте `.env` под свои нужды:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=simple_backend
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3000
```

> 💡 **Важно:** `.env` содержит ваши локальные настройки и не коммитится в git.  
> `.env.example` - это шаблон для других разработчиков.  
> Подробнее: [docs/ENV_FILES.md](./docs/ENV_FILES.md)
