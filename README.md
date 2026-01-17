# Simple Backend

Простой REST API бэкенд на Node.js с Fastify и PostgreSQL.

## 🚀 Быстрый старт

### Установка зависимостей

```bash
yarn install
```

### Настройка базы данных

1. Создайте файл `.env` (см. пример в `.env.example` если есть)
2. Запустите PostgreSQL в Docker:

```bash
yarn db:start
```

3. Инициализируйте базу данных:

```bash
yarn db:init
yarn db:seed
```

### Запуск сервера

```bash
yarn dev
```

Сервер запустится на `http://localhost:3000` с автоматической перезагрузкой при изменении файлов (nodemon).

## 📜 Скрипты

### Разработка

- `yarn dev` - запустить сервер с hot-reload (nodemon)
- `yarn test` - запустить тесты
- `yarn test:watch` - запустить тесты в watch режиме
- `yarn test:coverage` - запустить тесты с покрытием
- `yarn test:ui` - запустить тесты с UI интерфейсом

### База данных

- `yarn db:start` - запустить PostgreSQL в Docker
- `yarn db:stop` - остановить PostgreSQL
- `yarn db:init` - инициализировать базу данных (создать таблицы)
- `yarn db:seed` - заполнить базу тестовыми данными
- `yarn db:clear` - очистить таблицу users
- `yarn db:reset` - очистить и заполнить базу заново

## 🔧 Конфигурация

Настройки приложения задаются через переменные окружения в файле `.env`:

- `PORT` - порт сервера (по умолчанию: 3000)
- `DB_HOST` - хост базы данных
- `DB_PORT` - порт базы данных
- `DB_USER` - пользователь базы данных
- `DB_PASSWORD` - пароль базы данных
- `DB_NAME` - имя базы данных

## 📝 Лицензия

MIT
