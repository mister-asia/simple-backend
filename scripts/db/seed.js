import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { db } from "../../src/db/Db.js";
import { config } from "../../src/config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Скрипт для заполнения базы данных начальными данными
 */
async function seedDatabase() {
  const collection = "users";

  try {
    // Подключаемся к базе данных
    await db.connect(config.database);

    console.log("Начинаем заполнение базы данных...");

    // Проверяем существование таблицы
    const tableExists = await db.pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    if (!tableExists.rows[0].exists) {
      console.log(
        "Таблица users не существует. Сначала выполните: yarn db:init"
      );
      await db.close();
      return;
    }

    // Читаем данные из JSON файла
    const usersPath = join(__dirname, "..", "..", "src", "mock", "users.json");
    const usersData = JSON.parse(readFileSync(usersPath, "utf-8"));

    console.log(`Найдено ${usersData.length} пользователей для добавления`);

    // Проверяем, есть ли уже данные в базе
    const existingUsers = await db.find(collection);
    if (existingUsers.length > 0) {
      console.log(
        `В базе уже есть ${existingUsers.length} пользователей. Пропускаем заполнение.`
      );
      console.log(
        "Если хотите перезаполнить базу, сначала выполните: yarn db:clear"
      );
      await db.close();
      return;
    }

    // Вставляем пользователей в базу данных
    let insertedCount = 0;
    for (const user of usersData) {
      try {
        await db.insertOne(collection, user);
        insertedCount++;
      } catch (error) {
        console.error(
          `Ошибка при вставке пользователя ${user.id}:`,
          error.message
        );
      }
    }

    console.log(
      `Успешно добавлено ${insertedCount} пользователей в базу данных.`
    );
    await db.close();
  } catch (error) {
    console.error("Ошибка при заполнении базы данных:", error.message);
    await db.close();
    process.exit(1);
  }
}

// Запускаем скрипт
seedDatabase();
