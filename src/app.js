import Fastify from "fastify";
import userRoutes from "./routes/userRoutes.js";

export function createApp() {
  const fastify = Fastify({
    logger: true,
  });

  // Регистрируем роуты
  fastify.register(userRoutes);

  return fastify;
}

