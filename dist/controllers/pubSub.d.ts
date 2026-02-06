/**
 * Publie des erreurs sur un canal Redis spécifié.
 * @param channel - Le nom du canal sur lequel publier les erreurs.
 * @param errors - Les erreurs à publier. Doit être un objet JSON.
 */
export declare function publishToChannel(channel: string, errors: any): Promise<string | void>;
/**
 * S'abonne à un canal Redis spécifié pour recevoir des messages.
 * @param channel - Le nom du canal auquel s'abonner.
 */
export declare function subscribeToChannel(channel: string): Promise<void>;
