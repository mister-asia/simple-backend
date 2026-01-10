import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Выполняет shell команду и возвращает результат
 * @param {string} command - Команда для выполнения
 * @param {object} options - Опции для exec (cwd, env, etc.)
 * @returns {Promise<{stdout: string, stderr: string}>}
 */
export async function execCommand(command, options = {}) {
  try {
    const { stdout, stderr } = await execAsync(command, {
      ...options,
      encoding: "utf8",
    });
    return { stdout: stdout.trim(), stderr: stderr.trim() };
  } catch (error) {
    if (error.stdout || error.stderr) {
      return {
        stdout: error.stdout?.trim() || "",
        stderr: error.stderr?.trim() || "",
        error: error.message,
      };
    }
    throw error;
  }
}

/**
 * Выполняет команду и выводит результат в реальном времени
 * @param {string} command - Команда для выполнения
 * @param {object} options - Опции для exec
 */
export function execCommandStream(command, options = {}) {
  return new Promise((resolve, reject) => {
    const child = exec(command, {
      ...options,
      encoding: "utf8",
    });

    child.stdout?.on("data", (data) => {
      process.stdout.write(data);
    });

    child.stderr?.on("data", (data) => {
      process.stderr.write(data);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}
