/**
 * Приостанавливает выполнение на указанное количество миллисекунд
 * @param {number} ms - Количество миллисекунд
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
