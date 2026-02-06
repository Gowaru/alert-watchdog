"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.dbredis = exports.loggerCfg = exports.errorHandler = exports.processErrors = exports.version = exports.ErrorData = void 0;
exports.init = init;
exports.catchError = catchError;
const errorController_1 = require("./controllers/errorController");
Object.defineProperty(exports, "processErrors", { enumerable: true, get: function () { return errorController_1.processErrors; } });
Object.defineProperty(exports, "errorHandler", { enumerable: true, get: function () { return errorController_1.errorHandler; } });
const errorModel_1 = require("./models/errorModel");
Object.defineProperty(exports, "ErrorData", { enumerable: true, get: function () { return errorModel_1.ErrorData; } });
const logger_1 = require("./config/logger");
Object.defineProperty(exports, "loggerCfg", { enumerable: true, get: function () { return logger_1.loggerCfg; } });
const databaseConfig_1 = require("./config/databaseConfig");
Object.defineProperty(exports, "close", { enumerable: true, get: function () { return databaseConfig_1.closeRedis; } });
Object.defineProperty(exports, "dbredis", { enumerable: true, get: function () { return databaseConfig_1.dbConfig; } });
/**
 * Initialise le module alert-watchdog.
 * @param config - Configuration optionnelle pour le module.
 */
async function init(config = {}) {
    await (0, databaseConfig_1.initRedis)(config);
}
function catchError(callback, options = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await callback();
            resolve(result);
        }
        catch (error) {
            await (0, errorController_1.processErrors)({ error }, options)
                .then(errorData => {
                if (Array.isArray(errorData) && errorData.length === 1) {
                    reject(errorData[0]);
                }
                else {
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
exports.version = require('../package.json').version;
