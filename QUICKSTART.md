# 🚀 Быстрый старт

## Запуск за 3 команды

```bash
# 1. Настройка окружения
cp .env.example .env

# 2. Установка и настройка БД
make install && make setup

# 3. Запуск
make dev
```

Сервер запустится на `http://localhost:3000`

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

1. **`make install`** - устанавливает npm-зависимости
2. **`make setup`** состоит из:
   - `make db-up` - запускает PostgreSQL в Docker
   - `make db-init` - создает таблицы из `scripts/init.sql`
   - `make db-seed` - заполняет БД данными из `src/mock/users.json`
3. **`make dev`** - запускает сервер с hot-reload

## Полезные команды

```bash
make help        # 📖 Показать все команды
make db-logs     # 📋 Логи PostgreSQL
make test        # ✅ Запустить тесты
make db-reset    # 🔄 Пересоздать БД с нуля
```

## Остановка

```bash
# Остановить сервер: Ctrl+C

# Остановить базу данных
make db-down

# Удалить базу данных полностью
docker-compose down -v
```

## Проблемы?

**База не запускается:**

```bash
make db-reset  # Пересоздать БД
```

**Порт занят:**

```bash
# Измените порт в .env
DB_PORT=5433
PORT=3001
```

**Ошибка подключения к БД:**

```bash
# Проверьте статус контейнера
docker-compose ps

# Проверьте логи
make db-logs
```
