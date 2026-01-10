import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { execCommandStream } from "../utils/exec.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "../..");

/**
 * Полная настройка базы данных (init + seed)
 */
async function setupDatabase() {
  console.log("🗄️  Настройка базы данных...");

  try {
    // Запускаем init
    console.log("📋 Создание таблиц...");
    await execCommandStream(`node scripts/db/init.js`, {
      cwd: PROJECT_ROOT,
    });

    // Запускаем seed
    console.log("🌱 Заполнение данными...");
    await execCommandStream(`node scripts/db/seed.js`, {
      cwd: PROJECT_ROOT,
    });

    console.log("");
    console.log("✓ База данных настроена");
  } catch (error) {
    console.error("✗ Ошибка при настройке базы данных:", error.message);
    process.exit(1);
  }
}

setupDatabase();
