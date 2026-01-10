import { db } from "../../src/db/Db.js";
import { config } from "../../src/config/config.js";

/**
 * Скрипт для очистки таблицы users
 */
async function clearDatabase() {
  try {
    // Подключаемся к базе данных
    await db.connect(config.database);

    console.log("Проверка существования таблицы users...");

    // Проверяем существование таблицы
    const tableExists = await db.pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    if (!tableExists.rows[0].exists) {
      console.log("Таблица users не существует. Сначала выполните: yarn db:init");
      await db.close();
      return;
    }

    console.log("Очистка таблицы users...");

    // Используем TRUNCATE для быстрой очистки таблицы
    await db.pool.query('TRUNCATE TABLE "users" RESTART IDENTITY CASCADE');
    
    console.log("✓ Таблица users очищена.");
    await db.close();
  } catch (error) {
    console.error("✗ Ошибка при очистке базы данных:", error.message);
    await db.close();
    process.exit(1);
  }
}

// Запускаем скрипт
clearDatabase();
