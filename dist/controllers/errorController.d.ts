import { ErrorData } from '../models/errorModel';
export interface ProcessErrorsOptions {
    api?: {
        url: string;
    };
    pubsub?: {
        channel: string;
    };
    context?: any;
}
export interface ErrorHandlerOptions {
    NoCrash?: boolean;
}
/**
 * Traite les erreurs fournies en utilisant les options spécifiées.
 *
 * @param errors - Un objet ou une erreur à traiter.
 * @param options - Un objet contenant les options de traitement des erreurs.
 * @returns - Une Promesse résolue avec le tableau des ErrorData traités.
 */
export declare function processErrors(errors: any, options?: ProcessErrorsOptions): Promise<ErrorData[]>;
/**
 * Gère les erreurs non capturées et termine le processus en cas d'erreur, sauf si l'option 'doNotCrash' est définie à true.
 *
 * @param handler - Le gestionnaire d'erreurs personnalisé à exécuter.
 * @param options - Un objet contenant les options de gestion des erreurs.
 * @returns - Un objet avec la fonction report pour signaler manuellement les erreurs.
 */
export declare function errorHandler(handler: (error: any, context: any) => void, options?: ErrorHandlerOptions): {
    report: (error: any, context: any) => void;
};
