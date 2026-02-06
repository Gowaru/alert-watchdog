import { createClient } from 'redis';
import { dbConfig } from '../config/databaseConfig';
import dotenv from 'dotenv';
dotenv.config({ path: './src/.env' });

/**
 * Publie des erreurs sur un canal Redis spécifié.
 * @param channel - Le nom du canal sur lequel publier les erreurs.
 * @param errors - Les erreurs à publier. Doit être un objet JSON.
 */
export async function publishToChannel(channel: string, errors: any): Promise<string | void> {
  const pubSubEnabled = process.env.ALERT_WATCHDOG_REDIS_PUBSUB_ENABLED === 'false' ? false : true;
  if (!pubSubEnabled) {
    console.info("Configuration Redis désactivée. Impossible d'utiliser PUB/SUB pour les alerts.");
    return;
  } else {
    // Crée un client Redis pour la publication
    // @ts-ignore
    const publish = createClient(dbConfig);

    try {
      // Se connecte au serveur Redis
      await publish.connect();

      // Publie les erreurs sur le canal spécifié
      await publish.PUBLISH(channel, JSON.stringify(errors, null, 2));
      console.log(`Message publié sur le canal ${channel}.`);
      return channel;

    } catch (err) {
      console.error(`Erreur lors de la publication des erreurs : ${err}`);
    } finally {
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
export async function subscribeToChannel(channel: string): Promise<void> {
  const pubSubEnabled = process.env.ALERT_WATCHDOG_REDIS_PUBSUB_ENABLED === 'false' ? false : true;
  if (!pubSubEnabled) {
    console.info("Configuration Redis désactivée. Impossible d'utiliser PUB/SUB pour les alerts.");
  } else {
    // Crée un client Redis pour la souscription
    // @ts-ignore
    const redisClient = createClient(dbConfig);

    // Duplique le client pour la souscription
    const subscriber = redisClient.duplicate();

    try {
      // Se connecte au serveur Redis
      await subscriber.connect();

      // S'abonne au canal spécifié pour recevoir des messages
      await subscriber.SUBSCRIBE(channel, (message: string) => {
        console.log(`Souscription réussie au canal ${channel} : ${message}`);
      });
    } catch (err) {
      console.error(`Erreur lors de la souscription au canal ${channel} : ${err}`);
    }
    // Note: For subscription we typically don't close immediately otherwise we stop receiving
  }
}
