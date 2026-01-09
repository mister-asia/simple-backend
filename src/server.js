import { createApp } from "./app.js";
import { config } from "./config/config.js";
import { db } from "./db/Db.js";

const fastify = createApp();

// Запуск сервера
const start = async () => {
  try {
    // Подключаемся к базе данных
    await db.connect(config.database);

    // Запускаем сервер
    await fastify.listen({ port: config.port, host: config.host });
    console.log(`✓ Сервер запущен на http://localhost:${config.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Обработка graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nЗавершение работы...");
  await db.close();
  await fastify.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\nЗавершение работы...");
  await db.close();
  await fastify.close();
  process.exit(0);
});

start();
