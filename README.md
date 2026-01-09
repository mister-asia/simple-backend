# simple-backend

Простой backend на Node.js с использованием Fastify и PostgreSQL.

> 🚀 **Быстрый старт:** см. [QUICKSTART.md](./QUICKSTART.md)

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

### Быстрый старт с Docker

```bash
# 1. Скопировать пример конфигурации
cp .env.example .env

# 2. Запустить базу данных через Docker
make db-up

# 3. Установить зависимости
make install

# 4. Инициализировать и заполнить базу
make db-init
make db-seed

# 5. Запустить сервер в режиме разработки
make dev
```

Или одной командой:

```bash
cp .env.example .env && make install && make setup && make dev
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

### Ручная установка (без Make)

```bash
# Установка зависимостей
yarn install

# Создать .env файл с настройками БД
cp .env.example .env

# Запустить PostgreSQL через Docker
docker-compose up -d

# Инициализация базы данных (создание таблиц)
yarn db:init

# Заполнение базы тестовыми данными
yarn db:seed

# Запуск сервера
yarn start

# Запуск в режиме разработки
yarn dev

# Запуск тестов
yarn test
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
