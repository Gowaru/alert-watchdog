"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishToChannel = publishToChannel;
exports.subscribeToChannel = subscribeToChannel;
const redis_1 = require("redis");
const databaseConfig_1 = require("../config/databaseConfig");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './src/.env' });
/**
 * Publie des erreurs sur un canal Redis spécifié.
 * @param channel - Le nom du canal sur lequel publier les erreurs.
 * @param errors - Les erreurs à publier. Doit être un objet JSON.
 */
async function publishToChannel(channel, errors) {
    const pubSubEnabled = process.env.ALERT_WATCHDOG_REDIS_PUBSUB_ENABLED === 'false' ? false : true;
    if (!pubSubEnabled) {
        console.info("Configuration Redis désactivée. Impossible d'utiliser PUB/SUB pour les alerts.");
        return;
    }
    else {
        // Crée un client Redis pour la publication
        // @ts-ignore
        const publish = (0, redis_1.createClient)(databaseConfig_1.dbConfig);
        try {
            // Se connecte au serveur Redis
            await publish.connect();
            // Publie les erreurs sur le canal spécifié
            await publish.PUBLISH(channel, JSON.stringify(errors, null, 2));
            console.log(`Message publié sur le canal ${channel}.`);
            return channel;
        }
        catch (err) {
            console.error(`Erreur lors de la publication des erreurs : ${err}`);
        }
        finally {
            // Ferme la connexion au client Redis
            if (publish.isOpen) {
                await publish.quit();
            }
        }
    }
}
/**
 * S'abonne à un canal Redis spécifié pour recevoir des messages.
 * @param channel - Le nom du canal auquel s'abonner.
 */
async function subscribeToChannel(channel) {
    const pubSubEnabled = process.env.ALERT_WATCHDOG_REDIS_PUBSUB_ENABLED === 'false' ? false : true;
    if (!pubSubEnabled) {
        console.info("Configuration Redis désactivée. Impossible d'utiliser PUB/SUB pour les alerts.");
    }
    else {
        // Crée un client Redis pour la souscription
        // @ts-ignore
        const redisClient = (0, redis_1.createClient)(databaseConfig_1.dbConfig);
        // Duplique le client pour la souscription
        const subscriber = redisClient.duplicate();
        try {
            // Se connecte au serveur Redis
            await subscriber.connect();
            // S'abonne au canal spécifié pour recevoir des messages
            await subscriber.SUBSCRIBE(channel, (message) => {
                console.log(`Souscription réussie au canal ${channel} : ${message}`);
            });
        }
        catch (err) {
            console.error(`Erreur lors de la souscription au canal ${channel} : ${err}`);
        }
        // Note: For subscription we typically don't close immediately otherwise we stop receiving
    }
}
