import { describe, it, expect, beforeEach, afterEach } from "vitest";
import UserService from "./UserService.js";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("UserService", () => {
  let userService;
  const testFilePath = join(
    __dirname,
    "..",
    "..",
    "..",
    "mock",
    "test-users.json"
  );
  const testUsers = [
    { id: 1, name: "Иван Тестовый", email: "ivan.test@example.com" },
    { id: 2, name: "Мария Тестовая", email: "maria.test@example.com" },
    { id: 3, name: "Петр Тестовый", email: "petr.test@example.com" },
  ];

  beforeEach(() => {
    // Создаем тестовый файл с данными
    writeFileSync(testFilePath, JSON.stringify(testUsers, null, 2), "utf-8");

    // Создаем экземпляр сервиса
    userService = new UserService();
    // Переопределяем коллекцию на тестовую
    userService.collection = "test-users";
  });

  afterEach(() => {
    // Удаляем тестовый файл после каждого теста
    if (existsSync(testFilePath)) {
      unlinkSync(testFilePath);
    }
  });

  describe("getUsers", () => {
    it("должен вернуть всех пользователей", async () => {
      const result = await userService.getUsers();

      expect(result).toHaveLength(3);
      expect(result).toEqual(testUsers);
    });
  });

  describe("getUserById", () => {
    it("должен вернуть пользователя по ID", async () => {
      const result = await userService.getUserById(1);

      expect(result).toEqual(testUsers[0]);
    });

    it("должен вернуть null если пользователь не найден", async () => {
      const result = await userService.getUserById(999);

      expect(result).toBeNull();
    });
  });

  describe("getUsersPaginated", () => {
    it("должен вернуть пользователей с пагинацией", async () => {
      const result = await userService.getUsersPaginated(1, 2);

      expect(result.data).toHaveLength(2);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 2,
        total: 3,
        totalPages: 2,
      });
    });

    it("должен использовать значения по умолчанию для page и limit", async () => {
      const result = await userService.getUsersPaginated();

      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });

    it("должен вернуть вторую страницу", async () => {
      const result = await userService.getUsersPaginated(2, 2);

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual(testUsers[2]);
    });
  });

  describe("createUser", () => {
    it("должен создать нового пользователя", async () => {
      const newUser = { name: "Новый Пользователь", email: "new@example.com" };

      const result = await userService.createUser(newUser);

      expect(result).toHaveProperty("id");
      expect(result.id).toBe(4);
      expect(result.name).toBe(newUser.name);
      expect(result.email).toBe(newUser.email);

      // Проверяем что пользователь действительно добавлен
      const allUsers = await userService.getUsers();
      expect(allUsers).toHaveLength(4);
    });

    it("должен автоматически генерировать ID", async () => {
      const newUser1 = { name: "Пользователь 1", email: "user1@example.com" };
      const newUser2 = { name: "Пользователь 2", email: "user2@example.com" };

      const result1 = await userService.createUser(newUser1);
      const result2 = await userService.createUser(newUser2);

      expect(result1.id).toBe(4);
      expect(result2.id).toBe(5);
    });
  });

  describe("updateUser", () => {
    it("должен обновить пользователя по ID", async () => {
      const updateData = { name: "Иван Обновленный" };

      const result = await userService.updateUser(1, updateData);

      expect(result).toBe(1);

      // Проверяем что данные действительно обновились
      const updatedUser = await userService.getUserById(1);
      expect(updatedUser.name).toBe("Иван Обновленный");
      expect(updatedUser.email).toBe(testUsers[0].email); // email не изменился
    });

    it("должен вернуть 0 если пользователь не найден", async () => {
      const result = await userService.updateUser(999, { name: "Тест" });

      expect(result).toBe(0);
    });

    it("должен обновить несколько полей", async () => {
      const updateData = {
        name: "Иван Новый",
        email: "ivan.new@example.com",
      };

      await userService.updateUser(1, updateData);

      const updatedUser = await userService.getUserById(1);
      expect(updatedUser.name).toBe(updateData.name);
      expect(updatedUser.email).toBe(updateData.email);
    });
  });

  describe("deleteUser", () => {
    it("должен удалить пользователя по ID", async () => {
      const result = await userService.deleteUser(1);

      expect(result).toBe(1);

      // Проверяем что пользователь действительно удален
      const allUsers = await userService.getUsers();
      expect(allUsers).toHaveLength(2);

      const deletedUser = await userService.getUserById(1);
      expect(deletedUser).toBeNull();
    });

    it("должен вернуть 0 если пользователь не найден", async () => {
      const result = await userService.deleteUser(999);

      expect(result).toBe(0);
    });

    it("не должен удалять других пользователей", async () => {
      await userService.deleteUser(2);

      const user1 = await userService.getUserById(1);
      const user3 = await userService.getUserById(3);

      expect(user1).not.toBeNull();
      expect(user3).not.toBeNull();
    });
  });
});
