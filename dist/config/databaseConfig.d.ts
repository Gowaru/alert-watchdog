import { RedisClientType } from 'redis';
import { z } from 'zod';
declare const RedisConfigSchema: z.ZodObject<{
    host: z.ZodDefault<z.ZodString>;
    port: z.ZodDefault<z.ZodNumber>;
    password: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type RedisConfig = z.infer<typeof RedisConfigSchema>;
declare let dbConfig: RedisConfig;
export declare function initRedis(config?: {
    redis?: Partial<RedisConfig> | false;
}): Promise<RedisClientType | null>;
export declare function getRedisClient(): RedisClientType | null;
export declare function closeRedis(): Promise<void>;
export { dbConfig };
