import { execCommandStream } from "../utils/exec.js";

const COMPOSE_FILES = "-f docker-compose.yml -f docker-compose.dev.yml";
const rebuild = process.argv.includes("--rebuild");

/**
 * Запускает приложение в режиме разработки в Docker
 */
async function startDev() {
  const mode = rebuild ? "с пересборкой" : "";
  console.log(`🐳 Запуск приложения в режиме разработки ${mode}...`);

  try {
    const upCmd = rebuild
      ? `docker-compose ${COMPOSE_FILES} up -d --build`
      : `docker-compose ${COMPOSE_FILES} up -d`;

    await execCommandStream(upCmd, {
      cwd: process.cwd(),
    });

    console.log("");
    console.log("✓ Приложение запущено в режиме разработки");
    console.log("📋 Логи: yarn docker:dev:logs");
    console.log("🌐 Приложение доступно на http://localhost:3000");
  } catch (error) {
    console.error("✗ Ошибка при запуске:", error.message);
    process.exit(1);
  }
}

startDev();
