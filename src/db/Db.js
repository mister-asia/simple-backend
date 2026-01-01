import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Db {
  constructor() {
    this.dataPath = join(__dirname, "..", "mock");
  }

  /**
   * Получить путь к файлу данных (приватный метод)
   * @param {string} collection - Название коллекции (например, 'users')
   * @returns {string} Полный путь к файлу
   * @private
   */
  #getFilePath(collection) {
    return join(this.dataPath, `${collection}.json`);
  }

  /**
   * Проверить существование коллекции (приватный метод)
   * @param {string} collection - Название коллекции
   * @returns {boolean} Существует ли коллекция
   * @private
   */
  #collectionExists(collection) {
    const filePath = this.#getFilePath(collection);
    return existsSync(filePath);
  }

  /**
   * Найти все записи в коллекции
   * @param {string} collection - Название коллекции
   * @returns {Promise<Array>} Промис с массивом записей
   */
  async find(collection) {
    return new Promise((resolve, reject) => {
      try {
        const filePath = this.#getFilePath(collection);

        if (!this.#collectionExists(collection)) {
          return resolve([]);
        }

        const data = readFileSync(filePath, "utf-8");
        const records = JSON.parse(data);
        resolve(records);
      } catch (error) {
        reject(
          new Error(
            `Ошибка при чтении коллекции ${collection}: ${error.message}`
          )
        );
      }
    });
  }

  /**
   * Найти одну запись по условию
   * @param {string} collection - Название коллекции
   * @param {Object} query - Объект с условиями поиска
   * @returns {Promise<Object|null>} Промис с найденной записью или null
   */
  async findOne(collection, query) {
    return new Promise(async (resolve, reject) => {
      try {
        const records = await this.find(collection);
        const found = records.find((record) => {
          return Object.keys(query).every((key) => record[key] === query[key]);
        });
        resolve(found || null);
      } catch (error) {
        reject(new Error(`Ошибка при поиске записи: ${error.message}`));
      }
    });
  }

  /**
   * Найти записи по условию
   * @param {string} collection - Название коллекции
   * @param {Object} query - Объект с условиями поиска
   * @returns {Promise<Array>} Промис с массивом найденных записей
   */
  async findMany(collection, query) {
    return new Promise(async (resolve, reject) => {
      try {
        const records = await this.find(collection);
        const found = records.filter((record) => {
          return Object.keys(query).every((key) => record[key] === query[key]);
        });
        resolve(found);
      } catch (error) {
        reject(new Error(`Ошибка при поиске записей: ${error.message}`));
      }
    });
  }

  /**
   * Вставить одну запись
   * @param {string} collection - Название коллекции
   * @param {Object} data - Данные для вставки
   * @returns {Promise<Object>} Промис с вставленной записью
   */
  async insertOne(collection, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const records = await this.find(collection);

        // Генерируем ID если его нет
        if (!data.id) {
          const maxId =
            records.length > 0 ? Math.max(...records.map((r) => r.id || 0)) : 0;
          data.id = maxId + 1;
        }

        records.push(data);

        const filePath = this.#getFilePath(collection);
        writeFileSync(filePath, JSON.stringify(records, null, 2), "utf-8");

        resolve(data);
      } catch (error) {
        reject(new Error(`Ошибка при вставке записи: ${error.message}`));
      }
    });
  }

  /**
   * Обновить записи по условию
   * @param {string} collection - Название коллекции
   * @param {Object} query - Объект с условиями поиска
   * @param {Object} update - Объект с обновляемыми полями
   * @returns {Promise<number>} Промис с количеством обновленных записей
   */
  async updateMany(collection, query, update) {
    return new Promise(async (resolve, reject) => {
      try {
        const records = await this.find(collection);
        let updatedCount = 0;

        const updatedRecords = records.map((record) => {
          const matches = Object.keys(query).every(
            (key) => record[key] === query[key]
          );
          if (matches) {
            updatedCount++;
            return { ...record, ...update };
          }
          return record;
        });

        const filePath = this.#getFilePath(collection);
        writeFileSync(
          filePath,
          JSON.stringify(updatedRecords, null, 2),
          "utf-8"
        );

        resolve(updatedCount);
      } catch (error) {
        reject(new Error(`Ошибка при обновлении записей: ${error.message}`));
      }
    });
  }

  /**
   * Удалить записи по условию
   * @param {string} collection - Название коллекции
   * @param {Object} query - Объект с условиями поиска
   * @returns {Promise<number>} Промис с количеством удаленных записей
   */
  async deleteMany(collection, query) {
    return new Promise(async (resolve, reject) => {
      try {
        const records = await this.find(collection);
        const initialLength = records.length;

        const filteredRecords = records.filter((record) => {
          return !Object.keys(query).every((key) => record[key] === query[key]);
        });

        const deletedCount = initialLength - filteredRecords.length;

        const filePath = this.#getFilePath(collection);
        writeFileSync(
          filePath,
          JSON.stringify(filteredRecords, null, 2),
          "utf-8"
        );

        resolve(deletedCount);
      } catch (error) {
        reject(new Error(`Ошибка при удалении записей: ${error.message}`));
      }
    });
  }

  /**
   * Получить записи с пагинацией
   * @param {string} collection - Название коллекции
   * @param {number} page - Номер страницы (начиная с 1)
   * @param {number} limit - Количество записей на странице
   * @returns {Promise<Object>} Промис с объектом пагинации
   */
  async paginate(collection, page = 1, limit = 10) {
    return new Promise(async (resolve, reject) => {
      try {
        const records = await this.find(collection);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedRecords = records.slice(startIndex, endIndex);

        resolve({
          data: paginatedRecords,
          pagination: {
            page,
            limit,
            total: records.length,
            totalPages: Math.ceil(records.length / limit),
          },
        });
      } catch (error) {
        reject(new Error(`Ошибка при пагинации: ${error.message}`));
      }
    });
  }
}

export default Db;
