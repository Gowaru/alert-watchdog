import { z } from 'zod';
export declare const ErrorDataSchema: z.ZodObject<{
    level: z.ZodString;
    message: z.ZodString;
    name: z.ZodString;
    stack: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    timestamp: z.ZodOptional<z.ZodString>;
    context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    service: z.ZodOptional<z.ZodString>;
    environment: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ErrorDataType = z.infer<typeof ErrorDataSchema>;
export declare class ErrorData {
    level: string;
    message: string;
    name: string;
    stack: string | null;
    timestamp: string;
    context: Record<string, any>;
    service: string;
    environment: string;
    constructor(level: string, message: string, name: string, stack?: string | null, context?: Record<string, any>);
}
