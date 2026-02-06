import { z } from 'zod';

export const ErrorDataSchema = z.object({
  level: z.string(),
  message: z.string(),
  name: z.string(),
  stack: z.string().nullable().optional(),
  timestamp: z.string().optional(),
  context: z.record(z.string(), z.any()).optional(),
  service: z.string().optional(),
  environment: z.string().optional()
});

export type ErrorDataType = z.infer<typeof ErrorDataSchema>;

export class ErrorData {
  public level: string;
  public message: string;
  public name: string;
  public stack: string | null;
  public timestamp: string;
  public context: Record<string, any>;
  public service: string;
  public environment: string;

  constructor(
    level: string,
    message: string,
    name: string,
    stack: string | null = null,
    context: Record<string, any> = {}
  ) {
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
