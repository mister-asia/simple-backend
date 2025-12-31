import { createApp } from "./app.js";
import { config } from "./config/config.js";

const fastify = createApp();

// Запуск сервера
const start = async () => {
  try {
    await fastify.listen({ port: config.port, host: config.host });
    console.log(`Сервер запущен на http://localhost:${config.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
