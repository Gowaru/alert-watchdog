import { Alert, AlertSchema } from '../models/alertModel';
import { getRedisClient } from '../config/databaseConfig';
import { loggerCfg } from '../config/logger';
import dotenv from 'dotenv';
dotenv.config({ path: './src/.env' });

const LOG_PATH = process.env.ALERT_WATCHDOG_LOG_PATH || './logs/alert-watchdog';

/**
 * @function saveAlert
 * Enregistre une alerte dans Redis via une liste (Queue).
 * @param alertData - Les données de l'alerte à enregistrer.
 * @returns {Promise<void>}
 **/
export async function saveAlert(alertData: any): Promise<void> {
  const client = getRedisClient();

  // Si pas de client Redis initialisé/connecté, on log juste l'erreur
  if (!client || !client.isOpen) {
    // Optionnel : logger que Redis n'est pas dispo
    // loggerCfg(LOG_PATH).warn("Redis non disponible, alerte non sauvegardée en base.");
    return;
  }

  try {
    // Validate data before processing
    const validatedData = AlertSchema.parse(alertData);
    const alert = new Alert(validatedData);
    const alertString = JSON.stringify(alert);

    // Utilisation de RPUSH pour ajouter à la fin de la liste 'alerts'
    // C'est plus performant et garde l'historique
    await client.rPush('alerts', alertString);

    //loggerCfg(LOG_PATH).info("Alerte enregistrée avec succès dans Redis (Liste 'alerts')");

  } catch (error) {
    loggerCfg(LOG_PATH).error("Erreur lors de l'enregistrement de l'alerte dans Redis : ", error);
  }
}
