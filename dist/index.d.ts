import { processErrors, errorHandler, ProcessErrorsOptions, ErrorHandlerOptions } from './controllers/errorController';
import { ErrorData } from './models/errorModel';
import { loggerCfg } from './config/logger';
import { closeRedis, dbConfig } from './config/databaseConfig';
import { RedisConfig } from './config/databaseConfig';
export { RedisConfig, ProcessErrorsOptions, ErrorHandlerOptions, ErrorData };
/**
 * Initialise le module alert-watchdog.
 * @param config - Configuration optionnelle pour le module.
 */
export declare function init(config?: {
    redis?: RedisConfig | false;
}): Promise<void>;
export declare function catchError<T>(callback: () => Promise<T> | T, options?: ProcessErrorsOptions): Promise<T>;
/**
 * Expose version.
 */
export declare const version: any;
export { processErrors, errorHandler, loggerCfg, dbConfig as dbredis, closeRedis as close };
