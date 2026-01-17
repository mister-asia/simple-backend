import { exec } from "child_process";

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
