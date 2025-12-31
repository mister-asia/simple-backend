import UserService from "../services/UserService/UserService.js";

const userService = new UserService();

export default async function userRoutes(fastify, options) {
  // Роут для получения пользователей (с опциональной пагинацией)
  fastify.get("/users", async (request, reply) => {
    try {
      const page = request.query.page ? parseInt(request.query.page) : null;
      const limit = request.query.limit ? parseInt(request.query.limit) : null;

      // Если указаны параметры пагинации, возвращаем с пагинацией
      if (page || limit) {
        const result = await userService.getUsersPaginated(
          page || 1,
          limit || 10
        );
        return result;
      }

      // Иначе возвращаем всех пользователей
      const users = await userService.getUsers();
      return users;
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  });

  // Роут для получения пользователя по ID
  fastify.get("/users/:id", async (request, reply) => {
    try {
      const id = parseInt(request.params.id);
      const user = await userService.getUserById(id);

      if (!user) {
        return reply.code(404).send({ error: "Пользователь не найден" });
      }

      return user;
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  });
}

