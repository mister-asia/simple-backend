import { execCommand } from "../utils/exec.js";
import { sleep } from "../utils/sleep.js";

const MAX_ATTEMPTS = 30;
const ATTEMPT_DELAY = 2000; // 2 seconds
const DB_USER = process.env.DB_USER || "postgres";

/**
 * Ожидает готовности базы данных PostgreSQL
 */
async function waitForDatabase() {
  console.log("⏳ Ожидание готовности базы данных...");

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const { stdout, stderr } = await execCommand(
        `docker-compose exec -T postgres pg_isready -U ${DB_USER}`,
        {
          cwd: process.cwd(),
        }
      );

      if (stdout && stdout.includes("accepting connections")) {
        console.log("✓ База данных готова");
        return;
      }
    } catch (err) {
      // Игнорируем ошибки подключения, продолжаем попытки
    }

    console.log(`  Попытка ${attempt}/${MAX_ATTEMPTS}...`);
    if (attempt < MAX_ATTEMPTS) {
      await sleep(ATTEMPT_DELAY);
    }
  }

  console.error("✗ База данных не готова за", MAX_ATTEMPTS, "попыток");
  process.exit(1);
}

waitForDatabase();
