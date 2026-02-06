"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorData = exports.ErrorDataSchema = void 0;
const zod_1 = require("zod");
exports.ErrorDataSchema = zod_1.z.object({
    level: zod_1.z.string(),
    message: zod_1.z.string(),
    name: zod_1.z.string(),
    stack: zod_1.z.string().nullable().optional(),
    timestamp: zod_1.z.string().optional(),
    context: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    service: zod_1.z.string().optional(),
    environment: zod_1.z.string().optional()
});
class ErrorData {
    constructor(level, message, name, stack = null, context = {}) {
        this.level = level;
        this.message = message;
        this.name = name;
        this.stack = stack;
        this.timestamp = new Date().toISOString();
        this.context = context;
        this.service = process.env.npm_package_name || 'unknown-service';
        this.environment = process.env.NODE_ENV || 'development';
    }
}
exports.ErrorData = ErrorData;
