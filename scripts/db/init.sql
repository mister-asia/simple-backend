-- SQL скрипт для инициализации таблиц базы данных

-- Создание таблицы users
CREATE TABLE IF NOT EXISTS "users" (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

-- Создание индекса для быстрого поиска по email
CREATE INDEX IF NOT EXISTS idx_users_email ON "users"(email);

-- Создание индекса для быстрого поиска по id
CREATE INDEX IF NOT EXISTS idx_users_id ON "users"(id);

