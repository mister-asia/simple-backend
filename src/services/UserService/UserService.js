import Db from "../../db/Db.js";

class UserService {
  constructor() {
    this.db = new Db();
    this.collection = "users";
  }

  /**
   * Получить всех пользователей
   * @returns {Promise<Array>} Промис с массивом пользователей
   */
  async getUsers() {
    try {
      return await this.db.find(this.collection);
    } catch (error) {
      throw new Error(`Ошибка при чтении пользователей: ${error.message}`);
    }
  }

  /**
   * Получить пользователя по ID
   * @param {number} id - ID пользователя
   * @returns {Promise<Object|null>} Промис с пользователем или null
   */
  async getUserById(id) {
    try {
      return await this.db.findOne(this.collection, { id });
    } catch (error) {
      throw new Error(`Ошибка при поиске пользователя: ${error.message}`);
    }
  }

  /**
   * Получить пользователей с пагинацией
   * @param {number} page - Номер страницы (начиная с 1)
   * @param {number} limit - Количество пользователей на странице
   * @returns {Promise<Object>} Промис с объектом пагинации
   */
  async getUsersPaginated(page = 1, limit = 10) {
    try {
      return await this.db.paginate(this.collection, page, limit);
    } catch (error) {
      throw new Error(`Ошибка при пагинации: ${error.message}`);
    }
  }

  /**
   * Создать нового пользователя
   * @param {Object} userData - Данные пользователя
   * @returns {Promise<Object>} Промис с созданным пользователем
   */
  async createUser(userData) {
    try {
      return await this.db.insertOne(this.collection, userData);
    } catch (error) {
      throw new Error(`Ошибка при создании пользователя: ${error.message}`);
    }
  }

  /**
   * Обновить пользователя по ID
   * @param {number} id - ID пользователя
   * @param {Object} updateData - Данные для обновления
   * @returns {Promise<number>} Промис с количеством обновленных записей
   */
  async updateUser(id, updateData) {
    try {
      return await this.db.updateMany(this.collection, { id }, updateData);
    } catch (error) {
      throw new Error(`Ошибка при обновлении пользователя: ${error.message}`);
    }
  }

  /**
   * Удалить пользователя по ID
   * @param {number} id - ID пользователя
   * @returns {Promise<number>} Промис с количеством удаленных записей
   */
  async deleteUser(id) {
    try {
      return await this.db.deleteMany(this.collection, { id });
    } catch (error) {
      throw new Error(`Ошибка при удалении пользователя: ${error.message}`);
    }
  }
}

export default UserService;
