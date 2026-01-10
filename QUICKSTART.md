# 🚀 Быстрый старт

## 🐳 Разработка в Docker (рекомендуется)

**Запуск приложения и базы данных в Docker с hot-reload:**

```bash
# 1. Настройка окружения
cp .env.example .env

# 2. Собрать и запустить всё (БД + приложение + инициализация + hot-reload)
yarn setup:dev
```

Приложение запустится на `http://localhost:3000` с автоматической перезагрузкой при изменении файлов.

**Что делает `yarn setup:dev`:**
- Запускает PostgreSQL в Docker
- Собирает Docker образ приложения для разработки (с devDependencies)
- Монтирует исходный код для hot-reload
- Создает таблицы в БД
- Заполняет БД тестовыми данными
- Запускает приложение с `node --watch`

**Изменения в коде применяются автоматически!** ✨

## 🚀 Production в Docker

**Запуск приложения в production-режиме:**

```bash
# 1. Настройка окружения
cp .env.example .env

# 2. Собрать и запустить всё
yarn setup:docker
```

Приложение запустится на `http://localhost:3000` без hot-reload (production режим).

## Или с Make (3 команды)

```bash
cp .env.example .env
make install && make setup
make dev
```

## Проверка работы

```bash
# Получить всех пользователей
curl http://localhost:3000/users

# Получить пользователя по ID
curl http://localhost:3000/users/1

# С пагинацией
curl http://localhost:3000/users?page=1&limit=5
```

## Что происходит под капотом?

### Разработка в Docker (setup:dev):
1. **`docker:db:up`** - запускает PostgreSQL в Docker
2. **`docker:dev:build`** - собирает Docker образ для разработки (с devDependencies)
3. **Volumes** - монтирует исходный код для hot-reload
4. **`db:init`** - создает таблицы из `scripts/init.sql` (внутри контейнера)
5. **`db:seed`** - заполняет БД данными из `mock/users.json` (внутри контейнера)
6. **`node --watch`** - запускает сервер с автоматической перезагрузкой

### Production в Docker (setup:docker):
1. **`docker:build`** - собирает Docker образ приложения (production зависимости)
2. **`docker:up`** - запускает PostgreSQL и приложение в контейнерах
3. **`db:init`** - создает таблицы из `scripts/init.sql` (внутри контейнера)
4. **`db:seed`** - заполняет БД данными из `mock/users.json` (внутри контейнера)
5. **`node src/server.js`** - запускает сервер в production режиме

## Полезные команды

**Разработка в Docker (с hot-reload):**
```bash
yarn docker:dev:up      # 🚀 Запустить в режиме разработки
yarn docker:dev:down    # 🛑 Остановить
yarn docker:dev:logs    # 📋 Логи приложения
yarn docker:dev:rebuild # 🔄 Пересобрать и запустить
yarn setup:dev          # 🎯 Полная настройка для разработки
```

**Production в Docker:**
```bash
yarn docker:build       # 🔨 Собрать образ приложения
yarn docker:up          # 🚀 Запустить всё (БД + приложение)
yarn docker:down        # 🛑 Остановить всё
yarn docker:rebuild     # 🔄 Пересобрать и запустить
yarn docker:reset       # 🗑️ Пересоздать всё с нуля
yarn docker:logs        # 📋 Логи всех сервисов
yarn docker:app:logs    # 📋 Логи приложения
yarn docker:db:logs     # 📋 Логи базы данных
yarn setup:docker       # 🎯 Полная настройка для production
```

**База данных:**
```bash
yarn docker:db:up       # 🚀 Запустить только PostgreSQL
yarn docker:db:logs     # 📋 Логи БД
```

**Тестирование:**
```bash
yarn test               # ✅ Запустить тесты
yarn test:watch         # 👀 Тесты в watch режиме
```

**С Make:**
```bash
make help        # 📖 Показать все команды
make db-logs     # 📋 Логи PostgreSQL
make test        # ✅ Запустить тесты
```

## Остановка

**Разработка в Docker:**
```bash
yarn docker:dev:down    # Остановить приложение (разработка)
yarn docker:down        # Остановить всё (БД тоже)
```

**Production в Docker:**
```bash
yarn docker:down        # Остановить все контейнеры
yarn docker:reset       # Остановить и удалить все данные
```

## Проблемы?

**База не запускается:**

```bash
yarn docker:reset  # Пересоздать БД
```

**Порт занят:**

```bash
# Измените порт в .env
DB_PORT=5433
PORT=3001
```

**Ошибка подключения к БД:**

```bash
# Проверьте статус контейнеров
docker-compose ps

# Проверьте логи
yarn docker:logs        # Все сервисы
yarn docker:db:logs     # Только БД
yarn docker:app:logs    # Только приложение
```

**Перезапуск приложения в Docker:**

**Разработка:**
```bash
yarn docker:dev:rebuild # Пересобрать и перезапустить
docker-compose -f docker-compose.yml -f docker-compose.dev.yml restart app
```

**Production:**
```bash
yarn docker:restart     # Перезапустить все сервисы
docker-compose restart app  # Перезапустить только приложение
```
