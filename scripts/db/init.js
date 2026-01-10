import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { db } from "../../src/db/Db.js";
import { config } from "../../src/config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Скрипт для инициализации базы данных (создание таблиц)
 */
async function initDatabase() {
  try {
    // Подключаемся к базе данных
    await db.connect(config.database);

    console.log("Инициализация базы данных...");

    // Читаем SQL скрипт
    const sqlPath = join(__dirname, "init.sql");
    const sql = readFileSync(sqlPath, "utf-8");

    // Выполняем SQL скрипт
    await db.pool.query(sql);

    console.log("✓ База данных успешно инициализирована. Таблицы созданы.");
    await db.close();
  } catch (error) {
    console.error("✗ Ошибка при инициализации базы данных:", error.message);
    await db.close();
    process.exit(1);
  }
}

// Запускаем скрипт
initDatabase();
