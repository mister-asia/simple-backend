import Fastify from 'fastify';

const fastify = Fastify({
  logger: true
});

// Массив пользователей
const users = [
  { id: 1, name: 'Иван Иванов', email: 'ivan@example.com' },
  { id: 2, name: 'Мария Петрова', email: 'maria@example.com' },
  { id: 3, name: 'Алексей Сидоров', email: 'alexey@example.com' }
];

// Роут для получения пользователей
fastify.get('/users', async (request, reply) => {
  return users;
});

// Запуск сервера
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Сервер запущен на http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

