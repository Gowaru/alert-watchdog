import winston from 'winston';
import 'winston-daily-rotate-file';
export declare const loggerCfg: (logPath?: string) => winston.Logger;
