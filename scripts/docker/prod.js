import { execCommandStream } from "../utils/exec.js";

/**
 * Запускает приложение в production режиме в Docker
 */
async function startProd() {
  console.log("🐳 Запуск приложения в production режиме...");

  try {
    await execCommandStream(`docker-compose up -d --build`, {
      cwd: process.cwd(),
    });

    console.log("");
    console.log("✓ Приложение запущено в production режиме");
    console.log("📋 Логи: yarn docker:logs");
    console.log("🌐 Приложение доступно на http://localhost:3000");
  } catch (error) {
    console.error("✗ Ошибка при запуске:", error.message);
    process.exit(1);
  }
}

startProd();
