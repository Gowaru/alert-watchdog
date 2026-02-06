import { processErrors, errorHandler, ProcessErrorsOptions, ErrorHandlerOptions } from './controllers/errorController';
import { ErrorData } from './models/errorModel';
import { loggerCfg } from './config/logger';
import { initRedis, closeRedis, dbConfig, initRedis as initRedisConfig } from './config/databaseConfig';
import { RedisConfig } from './config/databaseConfig';

// Re-export types for consumers
export { RedisConfig, ProcessErrorsOptions, ErrorHandlerOptions, ErrorData };

/**
 * Initialise le module alert-watchdog.
 * @param config - Configuration optionnelle pour le module.
 */
export async function init(config: { redis?: RedisConfig | false } = {}): Promise<void> {
  await initRedis(config);
}

export function catchError<T>(callback: () => Promise<T> | T, options: ProcessErrorsOptions = {}): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    try {
      const result = await callback();
      resolve(result);
    } catch (error) {
      await processErrors({ error }, options)
        .then(errorData => {
          if (Array.isArray(errorData) && errorData.length === 1) {
            reject(errorData[0]);
          } else {
            reject(errorData);
          }
        })
        .catch(err => reject(err));
    }
  });
}

/**
 * Expose version.
 */
// Using require for package.json to avoid resolveJsonModule issues or purely relying on TS structure
// @ts-ignore
export const version = require('../package.json').version;

export {
  processErrors,
  errorHandler,
  loggerCfg,
  dbConfig as dbredis,
  closeRedis as close
};