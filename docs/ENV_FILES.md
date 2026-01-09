# 📝 Работа с переменными окружения

## Два файла - две роли

### `.env` (НЕ коммитится)
```bash
# ✗ В .gitignore
# ✓ Содержит реальные данные
# ✓ У каждого разработчика свой

DB_HOST=localhost
DB_PORT=5432
DB_NAME=my_real_database
DB_USER=admin
DB_PASSWORD=super_secret_password_123  # ← Реальный пароль!
PORT=3000
```

**Когда использовать:**
- Локальная разработка
- Реальные пароли и токены
- Персональные настройки

### `.env.example` (коммитится)
```bash
# ✓ В git
# ✓ Без секретов
# ✓ Одинаковый для всех

DB_HOST=localhost
DB_PORT=5432
DB_NAME=simple_backend
DB_USER=postgres
DB_PASSWORD=postgres              # ← Пример, не реальный пароль
PORT=3000
```

**Когда использовать:**
- Шаблон для новых разработчиков
- Документация требуемых переменных
- CI/CD как референс

## Workflow для нового разработчика

```bash
# 1. Клонировать репозиторий
git clone <repo>
cd simple-backend

# 2. Создать .env из примера
cp .env.example .env

# 3. Отредактировать .env под себя
nano .env  # или vim, или в IDE

# 4. Запустить проект
make setup && make dev
```

## Что должно быть в .gitignore?

```gitignore
# ✓ Правильно
.env
.env.local
.env.*.local

# ✗ НЕ добавлять
# .env.example  ← Это должно быть в git!
```

## Безопасность

### ❌ Плохо (все в git):
```
проект/
├── .env              # В git - ОПАСНО!
└── config.js         # Пароли в коде - ОПАСНО!
```

### ✅ Хорошо:
```
проект/
├── .env              # НЕ в git ✓
├── .env.example      # В git ✓
└── .gitignore        # Содержит .env ✓
```

## Разные окружения

Для продакшена используйте переменные окружения сервера:

```bash
# Production (на сервере)
export DB_HOST=prod-db.example.com
export DB_PASSWORD=real_prod_password
node src/server.js

# Или через Docker
docker run -e DB_HOST=prod-db.example.com ...

# Или через .env файл (но НЕ коммитить!)
```

## Проверка настроек

```javascript
// src/config/config.js
if (!process.env.DB_PASSWORD) {
  throw new Error('DB_PASSWORD не установлен! Скопируйте .env.example в .env');
}
```

## FAQ

**Q: Почему не один файл?**  
A: `.env` содержит секреты и не должен попасть в git. `.env.example` - это документация.

**Q: Что если я случайно закоммитил .env?**  
A: Немедленно поменяйте все пароли и удалите из истории git:
```bash
git filter-branch --index-filter 'git rm --cached --ignore-unmatch .env'
```

**Q: Можно ли использовать только .env.example?**  
A: Нет! Вам нужен локальный .env с реальными настройками для разработки.

**Q: Как обновить .env.example?**  
A: Когда добавляете новую переменную:
1. Добавьте в `.env.example` с примером значения
2. Добавьте в свой `.env` с реальным значением
3. Закоммитьте только `.env.example`

## Итого

| Файл | Git | Содержит | Цель |
|------|-----|----------|------|
| `.env` | ❌ Нет | Реальные секреты | Локальная работа |
| `.env.example` | ✅ Да | Примеры | Документация |

