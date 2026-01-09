.PHONY: help db-up db-down db-logs db-reset db-init db-seed install dev start test

help: ## Показать помощь
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Установить зависимости
	yarn install

db-up: ## Запустить PostgreSQL в Docker
	docker-compose up -d
	@echo "⏳ Ожидание готовности базы данных..."
	@sleep 5
	@echo "✓ PostgreSQL запущен на localhost:5432"

db-down: ## Остановить PostgreSQL
	docker-compose down

db-logs: ## Показать логи PostgreSQL
	docker-compose logs -f postgres

db-reset: ## Пересоздать базу данных (удалить volume и запустить заново)
	docker-compose down -v
	docker-compose up -d
	@echo "⏳ Ожидание готовности базы данных..."
	@sleep 5

db-init: ## Инициализировать таблицы
	yarn db:init

db-seed: ## Заполнить базу тестовыми данными
	yarn db:seed

db-clear: ## Очистить таблицы
	yarn db:clear

dev: ## Запустить сервер в режиме разработки
	yarn dev

start: ## Запустить сервер
	yarn start

test: ## Запустить тесты
	yarn test

setup: db-up db-init db-seed ## Полная настройка (запустить БД, создать таблицы, заполнить данными)
	@echo "✓ Настройка завершена! Теперь можно запустить: make dev"

