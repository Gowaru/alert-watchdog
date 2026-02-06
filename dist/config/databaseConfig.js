"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
exports.initRedis = initRedis;
exports.getRedisClient = getRedisClient;
exports.closeRedis = closeRedis;
const redis_1 = require("redis");
const logger_1 = require("./logger");
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './src/.env' });
// Define Zod schema for Redis configuration
const RedisConfigSchema = zod_1.z.object({
    host: zod_1.z.string().default('127.0.0.1'),
    port: zod_1.z.number().int().positive().default(6379),
    password: zod_1.z.string().optional().default('')
});
let client = null;
let dbConfig = {
    host: process.env.ALERT_WATCHDOG_REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.ALERT_WATCHDOG_REDIS_PORT || '6379', 10),
    password: process.env.ALERT_WATCHDOG_REDIS_PASSWORD || ''
};
exports.dbConfig = dbConfig;
let isEnabled = process.env.ALERT_WATCHDOG_REDIS_CONFIG_ENABLED === 'true';
// Fonction pour initialiser la connexion Redis (Singleton)
async function initRedis(config = {}) {
    if (config.redis) {
        exports.dbConfig = dbConfig = { ...dbConfig, ...config.redis };
        isEnabled = true;
    }
    else if (config.redis === false) {
        isEnabled = false;
        return null;
    }
    // Validate configuration using Zod
    if (isEnabled) {
        try {
            exports.dbConfig = dbConfig = RedisConfigSchema.parse(dbConfig);
        }
        catch (error) {
            (0, logger_1.loggerCfg)().error('Invalid Redis configuration:', error);
            throw error;
        }
    }
    if (!isEnabled) {
        return null;
    }
    if (client) {
        return client;
    }
    const redisUrl = `redis://:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}`;
    // @ts-ignore
    client = (0, redis_1.createClient)({
        url: redisUrl
    });
    if (!client) {
        throw new Error("Failed to create Redis client");
    }
    client.on('error', (err) => {
        (0, logger_1.loggerCfg)().error('Redis Client Error', err);
    });
    try {
        await client.connect();
        (0, logger_1.loggerCfg)().info('Connected to Redis');
    }
    catch (err) {
        (0, logger_1.loggerCfg)().error('Could not connect to Redis', err);
        client = null; // Reset client on failure
        throw err;
    }
    return client;
}
// Fonction pour obtenir le client existant
function getRedisClient() {
    return client;
}
// Fonction pour fermer la connexion proprement
async function closeRedis() {
    if (client) {
        await client.quit();
        client = null;
        (0, logger_1.loggerCfg)().info('Redis connection closed');
    }
}
