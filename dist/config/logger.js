"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerCfg = void 0;
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './src/.env' });
// Configuration du logger avec les transports
const loggerCfg = (logPath = process.env.ALERT_WATCHDOG_LOG_PATH || './logs/alert-watchdog') => {
    const logEnabled = process.env.ALERT_WATCHDOG_LOG_ENABLED === 'false' ? false : true;
    if (!logEnabled) {
        // Retourne un logger silencieux ou mock si désactivé, ou log juste un warn et retourne un logger vide
        // Pour simplifier et garder la compatibilité avec le code existant qui attend un logger :
        const silentLogger = winston_1.default.createLogger({
            transports: [
                new winston_1.default.transports.Console({ silent: true })
            ]
        });
        silentLogger.warn("vous n'avez pas souscription aux log des alerts");
        return silentLogger;
    }
    else {
        const logger = winston_1.default.createLogger({
            transports: [
                // Transport pour les journaux quotidiens rotatifs
                new winston_1.default.transports.DailyRotateFile({
                    filename: `${logPath}%DATE%.log`, // Nom du fichier journal avec la date actuelle
                    datePattern: 'YYYY-MM-DD', // Format de la date dans le nom du fichier
                    zippedArchive: false, // Désactivation de l'archivage compressé des fichiers journaux
                    maxSize: '450m', // Taille maximale d'un fichier journal avant de créer un nouveau fichier
                    maxFiles: '30d', // Nombre de jours pendant lesquels les fichiers journaux sont conservés
                    level: 'info', // Niveau de journalisation défini sur "info"
                    format: winston_1.default.format.combine(winston_1.default.format.printf((info) => {
                        return `${(new Date()).toJSON().replace("T", " ").replace("Z", "")}; ${info.level.toUpperCase()}; ${info.message}`;
                    }))
                }),
                // Transport pour l'affichage des journaux dans la console
                new (winston_1.default.transports.Console)({
                    level: 'info', // Niveau de journalisation défini sur "info"
                    format: winston_1.default.format.combine(winston_1.default.format.colorize(), // Activation de la coloration des journaux dans la console
                    winston_1.default.format.printf((info) => {
                        return `${(new Date()).toJSON().replace("T", " ").replace("Z", "")}; ${info.level}; ${info.message}`;
                    }))
                })
            ]
        });
        return logger;
    }
};
exports.loggerCfg = loggerCfg;
