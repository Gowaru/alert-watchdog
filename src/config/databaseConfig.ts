import { createClient, RedisClientType } from 'redis';
import { loggerCfg } from './logger';
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config({ path: './src/.env' });

// Define Zod schema for Redis configuration
const RedisConfigSchema = z.object({
  host: z.string().default('127.0.0.1'),
  port: z.number().int().positive().default(6379),
  password: z.string().optional().default('')
});

export type RedisConfig = z.infer<typeof RedisConfigSchema>;

let client: RedisClientType | null = null;
let dbConfig: RedisConfig = {
  host: process.env.ALERT_WATCHDOG_REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.ALERT_WATCHDOG_REDIS_PORT || '6379', 10),
  password: process.env.ALERT_WATCHDOG_REDIS_PASSWORD || ''
};
let isEnabled = process.env.ALERT_WATCHDOG_REDIS_CONFIG_ENABLED === 'true';

// Fonction pour initialiser la connexion Redis (Singleton)
export async function initRedis(config: { redis?: Partial<RedisConfig> | false } = {}): Promise<RedisClientType | null> {
  if (config.redis) {
    dbConfig = { ...dbConfig, ...config.redis };
    isEnabled = true;
  } else if (config.redis === false) {
    isEnabled = false;
    return null;
  }

  // Validate configuration using Zod
  if (isEnabled) {
    try {
      dbConfig = RedisConfigSchema.parse(dbConfig);
    } catch (error) {
      loggerCfg().error('Invalid Redis configuration:', error);
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
  client = createClient({
    url: redisUrl
  });

  if (!client) {
    throw new Error("Failed to create Redis client");
  }

  client.on('error', (err: Error) => {
    loggerCfg().error('Redis Client Error', err);
  });

  try {
    await client.connect();
    loggerCfg().info('Connected to Redis');
  } catch (err) {
    loggerCfg().error('Could not connect to Redis', err);
    client = null; // Reset client on failure
    throw err;
  }

  return client;
}

// Fonction pour obtenir le client existant
export function getRedisClient(): RedisClientType | null {
  return client;
}

// Fonction pour fermer la connexion proprement
export async function closeRedis(): Promise<void> {
  if (client) {
    await client.quit();
    client = null;
    loggerCfg().info('Redis connection closed');
  }
}

export { dbConfig };