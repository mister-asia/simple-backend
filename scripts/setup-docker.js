import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { execCommandStream } from "./utils/exec.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "..");

/**
 * Полная настройка проекта для production в Docker
 */
async function setupDocker() {
  console.log("🚀 Настройка проекта для production в Docker...");
  console.log("");

  try {
    // Собираем образ
    console.log("🔨 Сборка образа приложения...");
    await execCommandStream(`docker-compose build`, {
      cwd: PROJECT_ROOT,
    });

    // Запускаем базу данных
    console.log("");
    console.log("📦 Запуск PostgreSQL...");
    await execCommandStream(`docker-compose up -d postgres`, {
      cwd: PROJECT_ROOT,
    });

    // Ждем готовности БД
    console.log("");
    await execCommandStream(`node scripts/docker/waitDb.js`, {
      cwd: PROJECT_ROOT,
    });

    // Инициализируем БД
    console.log("");
    console.log("🗄️  Инициализация базы данных...");
    await execCommandStream(
      `docker-compose run --rm app node scripts/db/init.js`,
      {
        cwd: PROJECT_ROOT,
      }
    );

    // Заполняем БД данными
    console.log("");
    console.log("🌱 Заполнение базы данных...");
    await execCommandStream(
      `docker-compose run --rm app node scripts/db/seed.js`,
      {
        cwd: PROJECT_ROOT,
      }
    );

    // Запускаем приложение
    console.log("");
    console.log("🚀 Запуск приложения...");
    await execCommandStream(`docker-compose up -d app`, {
      cwd: PROJECT_ROOT,
    });

    console.log("");
    console.log("✓ Всё готово!");
    console.log("🌐 Приложение доступно на http://localhost:3000");
    console.log("📋 Логи: yarn docker:logs");
  } catch (error) {
    console.error("");
    console.error("✗ Ошибка при настройке:", error.message);
    process.exit(1);
  }
}

setupDocker();
