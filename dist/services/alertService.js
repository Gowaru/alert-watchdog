"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAlert = saveAlert;
const alertModel_1 = require("../models/alertModel");
const databaseConfig_1 = require("../config/databaseConfig");
const logger_1 = require("../config/logger");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './src/.env' });
const LOG_PATH = process.env.ALERT_WATCHDOG_LOG_PATH || './logs/alert-watchdog';
/**
 * @function saveAlert
 * Enregistre une alerte dans Redis via une liste (Queue).
 * @param alertData - Les données de l'alerte à enregistrer.
 * @returns {Promise<void>}
 **/
async function saveAlert(alertData) {
    const client = (0, databaseConfig_1.getRedisClient)();
    // Si pas de client Redis initialisé/connecté, on log juste l'erreur
    if (!client || !client.isOpen) {
        // Optionnel : logger que Redis n'est pas dispo
        // loggerCfg(LOG_PATH).warn("Redis non disponible, alerte non sauvegardée en base.");
        return;
    }
    try {
        // Validate data before processing
        const validatedData = alertModel_1.AlertSchema.parse(alertData);
        const alert = new alertModel_1.Alert(validatedData);
        const alertString = JSON.stringify(alert);
        // Utilisation de RPUSH pour ajouter à la fin de la liste 'alerts'
        // C'est plus performant et garde l'historique
        await client.rPush('alerts', alertString);
        //loggerCfg(LOG_PATH).info("Alerte enregistrée avec succès dans Redis (Liste 'alerts')");
    }
    catch (error) {
        (0, logger_1.loggerCfg)(LOG_PATH).error("Erreur lors de l'enregistrement de l'alerte dans Redis : ", error);
    }
}
