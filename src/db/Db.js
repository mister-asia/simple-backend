import pg from "pg";

const { Pool } = pg;

class Db {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }

  /**
   * Подключиться к базе данных
   * @param {Object} config - Конфигурация подключения к БД
   * @param {string} config.host - Хост базы данных
   * @param {number} config.port - Порт базы данных
   * @param {string} config.database - Название базы данных
   * @param {string} config.user - Имя пользователя
   * @param {string} config.password - Пароль
   * @returns {Promise<void>}
   */
  async connect(config) {
    if (this.isConnected) {
      console.log("База данных уже подключена");
      return;
    }

    try {
      this.pool = new Pool(config);
      // Проверяем подключение
      await this.pool.query("SELECT NOW()");
      this.isConnected = true;
      console.log("✓ Успешно подключено к базе данных");
    } catch (error) {
      console.error("✗ Ошибка подключения к базе данных:", error.message);
      throw error;
    }
  }

  /**
   * Закрыть пул подключений
   */
  async close() {
    if (this.pool) {
      await this.pool.end();
      this.isConnected = false;
      console.log("✓ Подключение к базе данных закрыто");
    }
  }

  /**
   * Получить имя таблицы из коллекции (приватный метод)
   * @param {string} collection - Название коллекции (например, 'users')
   * @returns {string} Имя таблицы
   * @private
   */
  #getTableName(collection) {
    // Экранируем имя таблицы для безопасности
    return `"${collection}"`;
  }

  /**
   * Найти все записи в коллекции
   * @param {string} collection - Название коллекции
   * @returns {Promise<Array>} Промис с массивом записей
   */
  async find(collection) {
    try {
      const tableName = this.#getTableName(collection);
      const result = await this.pool.query(`SELECT * FROM ${tableName}`);
      return result.rows;
    } catch (error) {
      throw new Error(
        `Ошибка при чтении коллекции ${collection}: ${error.message}`
      );
    }
  }

  /**
   * Найти одну запись по условию
   * @param {string} collection - Название коллекции
   * @param {Object} query - Объект с условиями поиска
   * @returns {Promise<Object|null>} Промис с найденной записью или null
   */
  async findOne(collection, query) {
    try {
      const tableName = this.#getTableName(collection);
      const conditions = Object.keys(query)
        .map((key, index) => `"${key}" = $${index + 1}`)
        .join(" AND ");
      const values = Object.values(query);

      const result = await this.pool.query(
        `SELECT * FROM ${tableName} WHERE ${conditions} LIMIT 1`,
        values
      );

      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Ошибка при поиске записи: ${error.message}`);
    }
  }

  /**
   * Найти записи по условию
   * @param {string} collection - Название коллекции
   * @param {Object} query - Объект с условиями поиска
   * @returns {Promise<Array>} Промис с массивом найденных записей
   */
  async findMany(collection, query) {
    try {
      const tableName = this.#getTableName(collection);
      const conditions = Object.keys(query)
        .map((key, index) => `"${key}" = $${index + 1}`)
        .join(" AND ");
      const values = Object.values(query);

      const result = await this.pool.query(
        `SELECT * FROM ${tableName} WHERE ${conditions}`,
        values
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Ошибка при поиске записей: ${error.message}`);
    }
  }

  /**
   * Вставить одну запись
   * @param {string} collection - Название коллекции
   * @param {Object} data - Данные для вставки
   * @returns {Promise<Object>} Промис с вставленной записью
   */
  async insertOne(collection, data) {
    try {
      const tableName = this.#getTableName(collection);

      // Если ID не указан, генерируем его автоматически
      if (!data.id) {
        const maxIdResult = await this.pool.query(
          `SELECT COALESCE(MAX(id), 0) as max_id FROM ${tableName}`
        );
        const maxId = parseInt(maxIdResult.rows[0].max_id) || 0;
        data.id = maxId + 1;
      }

      const keys = Object.keys(data);
      const columns = keys.map((key) => `"${key}"`).join(", ");
      const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");
      const values = Object.values(data);

      const result = await this.pool.query(
        `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`,
        values
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Ошибка при вставке записи: ${error.message}`);
    }
  }

  /**
   * Обновить записи по условию
   * @param {string} collection - Название коллекции
   * @param {Object} query - Объект с условиями поиска
   * @param {Object} update - Объект с обновляемыми полями
   * @returns {Promise<number>} Промис с количеством обновленных записей
   */
  async updateMany(collection, query, update) {
    try {
      const tableName = this.#getTableName(collection);
      const updateFields = Object.keys(update)
        .map((key, index) => `"${key}" = $${index + 1}`)
        .join(", ");
      const conditions = Object.keys(query)
        .map(
          (key, index) =>
            `"${key}" = $${Object.keys(update).length + index + 1}`
        )
        .join(" AND ");

      const values = [...Object.values(update), ...Object.values(query)];

      const result = await this.pool.query(
        `UPDATE ${tableName} SET ${updateFields} WHERE ${conditions}`,
        values
      );

      return result.rowCount;
    } catch (error) {
      throw new Error(`Ошибка при обновлении записей: ${error.message}`);
    }
  }

  /**
   * Удалить записи по условию
   * @param {string} collection - Название коллекции
   * @param {Object} query - Объект с условиями поиска
   * @returns {Promise<number>} Промис с количеством удаленных записей
   */
  async deleteMany(collection, query) {
    try {
      const tableName = this.#getTableName(collection);
      const conditions = Object.keys(query)
        .map((key, index) => `"${key}" = $${index + 1}`)
        .join(" AND ");
      const values = Object.values(query);

      const result = await this.pool.query(
        `DELETE FROM ${tableName} WHERE ${conditions}`,
        values
      );

      return result.rowCount;
    } catch (error) {
      throw new Error(`Ошибка при удалении записей: ${error.message}`);
    }
  }

  /**
   * Получить записи с пагинацией
   * @param {string} collection - Название коллекции
   * @param {number} page - Номер страницы (начиная с 1)
   * @param {number} limit - Количество записей на странице
   * @returns {Promise<Object>} Промис с объектом пагинации
   */
  async paginate(collection, page = 1, limit = 10) {
    try {
      const tableName = this.#getTableName(collection);
      const offset = (page - 1) * limit;

      // Получаем общее количество записей
      const countResult = await this.pool.query(
        `SELECT COUNT(*) as total FROM ${tableName}`
      );
      const total = parseInt(countResult.rows[0].total);

      // Получаем записи с пагинацией
      const result = await this.pool.query(
        `SELECT * FROM ${tableName} ORDER BY id LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      return {
        data: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Ошибка при пагинации: ${error.message}`);
    }
  }
}

// Создаем и экспортируем единственный экземпляр (Singleton)
export const db = new Db();
