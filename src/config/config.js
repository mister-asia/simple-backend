import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Загружаем переменные окружения из родительской папки
const envPath = join(__dirname, "..", "..", "..", "backend.env");
dotenv.config({ path: envPath });

export const config = {
  port: process.env.PORT || 3000,
  host: "0.0.0.0",
};
