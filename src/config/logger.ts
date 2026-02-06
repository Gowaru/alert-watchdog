import winston from 'winston';
import 'winston-daily-rotate-file';
import dotenv from 'dotenv';
dotenv.config({ path: './src/.env' });

// Configuration du logger avec les transports
export const loggerCfg = (logPath: string = process.env.ALERT_WATCHDOG_LOG_PATH || './logs/alert-watchdog'): winston.Logger => {
  const logEnabled = process.env.ALERT_WATCHDOG_LOG_ENABLED === 'false' ? false : true;

  if (!logEnabled) {
    // Retourne un logger silencieux ou mock si désactivé, ou log juste un warn et retourne un logger vide
    // Pour simplifier et garder la compatibilité avec le code existant qui attend un logger :
    const silentLogger = winston.createLogger({
      transports: [
        new winston.transports.Console({ silent: true })
      ]
    });
    silentLogger.warn("vous n'avez pas souscription aux log des alerts");
    return silentLogger;
  } else {
    const logger = winston.createLogger({
      transports: [
        // Transport pour les journaux quotidiens rotatifs
        new winston.transports.DailyRotateFile({
          filename: `${logPath}%DATE%.log`, // Nom du fichier journal avec la date actuelle
          datePattern: 'YYYY-MM-DD', // Format de la date dans le nom du fichier
          zippedArchive: false, // Désactivation de l'archivage compressé des fichiers journaux
          maxSize: '450m', // Taille maximale d'un fichier journal avant de créer un nouveau fichier
          maxFiles: '30d', // Nombre de jours pendant lesquels les fichiers journaux sont conservés
          level: 'info', // Niveau de journalisation défini sur "info"
          format: winston.format.combine(
            winston.format.printf((info) => {
              return `${(new Date()).toJSON().replace("T", " ").replace("Z", "")}; ${info.level.toUpperCase()}; ${info.message}`;
            })
          )
        }),
        // Transport pour l'affichage des journaux dans la console
        new (winston.transports.Console)({
          level: 'info', // Niveau de journalisation défini sur "info"
          format: winston.format.combine(
            winston.format.colorize(), // Activation de la coloration des journaux dans la console
            winston.format.printf((info) => {
              return `${(new Date()).toJSON().replace("T", " ").replace("Z", "")}; ${info.level}; ${info.message}`;
            })
          )
        })
      ]
    });

    return logger;
  }
};
