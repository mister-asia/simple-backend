import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { execCommandStream } from "./utils/exec.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "..");

/**
 * Настройка базы данных для локальной разработки (только БД в Docker)
 */
async function setup() {
  console.log("🚀 Настройка базы данных для локальной разработки...");
  console.log("");

  try {
    // Запускаем базу данных
    console.log("📦 Запуск PostgreSQL...");
    await execCommandStream(`docker-compose up -d postgres`, {
      cwd: PROJECT_ROOT,
    });

    // Ждем готовности БД
    console.log("");
    await execCommandStream(`node scripts/docker/waitDb.js`, {
      cwd: PROJECT_ROOT,
    });

    // Настраиваем БД
    console.log("");
    await execCommandStream(`node scripts/db/setup.js`, {
      cwd: PROJECT_ROOT,
    });

    console.log("");
    console.log("✓ База данных настроена");
    console.log("💻 Запустите приложение локально: yarn dev");
  } catch (error) {
    console.error("");
    console.error("✗ Ошибка при настройке:", error.message);
    process.exit(1);
  }
}

setup();
