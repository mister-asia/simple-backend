import { execCommandStream } from "../utils/exec.js";

/**
 * Пересоздает все контейнеры с удалением данных
 */
async function resetDocker() {
  console.log("🗑️  Остановка и удаление всех контейнеров и данных...");

  try {
    await execCommandStream(`docker-compose down -v`, {
      cwd: process.cwd(),
    });

    console.log("");
    console.log("✓ Контейнеры остановлены и данные удалены");
    console.log("💡 Используйте yarn setup:dev или yarn setup:docker для запуска заново");
  } catch (error) {
    console.error("✗ Ошибка при сбросе:", error.message);
    process.exit(1);
  }
}

resetDocker();
