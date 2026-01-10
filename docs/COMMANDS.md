# 📋 Шпаргалка по командам

## 🐳 Docker команды

### Разработка (hot-reload)

| Команда | Описание |
|---------|----------|
| `yarn docker:dev:build` | Собрать образ для разработки |
| `yarn docker:dev:up` | Запустить в режиме разработки (hot-reload) |
| `yarn docker:dev:down` | Остановить (разработка) |
| `yarn docker:dev:logs` | Логи приложения (разработка) |
| `yarn docker:dev:rebuild` | Пересобрать и запустить (разработка) |

### Production

| Команда | Описание |
|---------|----------|
| `yarn docker:build` | Собрать образ приложения |
| `yarn docker:up` | Запустить все сервисы (БД + приложение) |
| `yarn docker:down` | Остановить все сервисы |
| `yarn docker:restart` | Перезапустить все сервисы |
| `yarn docker:rebuild` | Пересобрать и запустить |
| `yarn docker:reset` | Пересоздать всё с нуля (удалить данные) |
| `yarn docker:logs` | Показать логи всех сервисов |
| `yarn docker:app:logs` | Показать логи приложения |

### База данных

| Команда | Описание |
|---------|----------|
| `yarn docker:db:up` | Запустить только БД |
| `yarn docker:db:logs` | Логи базы данных |

## 🗄️ База данных

| Команда | Описание |
|---------|----------|
| `yarn db:init` | Создать таблицы |
| `yarn db:seed` | Заполнить тестовыми данными |
| `yarn db:clear` | Очистить все таблицы |
| `yarn db:reset` | Очистить и заполнить заново |
| `yarn db:setup` | Создать таблицы + заполнить |

## 🚀 Сервер

| Команда | Описание |
|---------|----------|
| `yarn start` | Запустить сервер локально |
| `yarn dev` | Запустить локально с hot-reload |
| `yarn dev:docker` | Запустить в Docker с hot-reload |

## ✅ Тестирование

| Команда | Описание |
|---------|----------|
| `yarn test` | Запустить все тесты |
| `yarn test:watch` | Тесты в режиме watch |
| `yarn test:coverage` | Тесты с coverage отчетом |
| `yarn test:ui` | Тесты с UI интерфейсом |

## 🎯 Комплексные команды

| Команда | Описание |
|---------|----------|
| `yarn setup:dev` | Разработка в Docker: БД + приложение + hot-reload + инициализация |
| `yarn setup:docker` | Production в Docker: БД + приложение + инициализация |

## 🔧 Прямые Docker Compose команды

Если нужно больше контроля:

```bash
# Запустить
docker-compose up -d

# Остановить
docker-compose down

# Остановить и удалить данные
docker-compose down -v

# Логи
docker-compose logs -f              # Все сервисы
docker-compose logs -f app          # Только приложение
docker-compose logs -f postgres     # Только БД

# Статус
docker-compose ps

# Перезапустить
docker-compose restart              # Все сервисы
docker-compose restart app          # Только приложение
docker-compose restart postgres     # Только БД

# Зайти в контейнер
docker-compose exec app sh          # В контейнер приложения
docker-compose exec postgres bash   # В контейнер БД

# Подключиться к БД напрямую
docker-compose exec postgres psql -U postgres -d simple_backend

# Выполнить команду в контейнере приложения
docker-compose exec app node scripts/init.js
docker-compose exec app node scripts/seed.js
```

## 💡 Типичные сценарии

### 🐳 Разработка в Docker (рекомендуется)

```bash
cp .env.example .env
yarn setup:dev     # Собирает, запускает и настраивает всё с hot-reload
```

### 🚀 Production в Docker

```bash
cp .env.example .env
yarn setup:docker  # Собирает, запускает и настраивает всё (production)
```

### Обычная разработка

**В Docker:**
```bash
yarn docker:up     # Запустить всё
```

**Локально:**
```bash
yarn dev           # Сервер подключится к запущенной БД
```

### Проблемы с БД

**Разработка в Docker:**
```bash
yarn docker:dev:rebuild  # Пересобрать и перезапустить
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec app node scripts/init.js
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec app node scripts/seed.js
```

**Production в Docker:**
```bash
yarn docker:reset  # Пересоздать всё
docker-compose exec app node scripts/init.js
docker-compose exec app node scripts/seed.js
```

### Чистый старт

**Разработка:**
```bash
yarn docker:reset  # Удалить всё и пересоздать
yarn setup:dev     # Настроить заново
```

**Production:**
```bash
yarn docker:reset  # Удалить всё и пересоздать
yarn setup:docker  # Настроить заново
```

### Посмотреть данные в БД

```bash
docker-compose exec postgres psql -U postgres -d simple_backend

# В psql:
\dt                    # Список таблиц
SELECT * FROM users;   # Данные пользователей
\q                     # Выход
```

## 🛠️ Make альтернативы

Если предпочитаете Make:

| yarn | Make | Описание |
|-----|------|----------|
| `yarn install` | `make install` | Установить зависимости |
| `yarn docker:up` | `make db-up` | Запустить БД |
| `yarn docker:down` | `make db-down` | Остановить БД |
| `yarn docker:logs` | `make db-logs` | Логи БД |
| `yarn setup` | `make setup` | Полная настройка |
| `yarn dev` | `make dev` | Запустить сервер |
| `yarn test` | `make test` | Тесты |
| - | `make help` | Все команды |

