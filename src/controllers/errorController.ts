
import { saveAlert } from "../services/alertService";
import { ErrorData } from '../models/errorModel';
import unhandled from "unhandled-rejection";
import sendToApi from "../services/apiService";
import { publishToChannel } from "./pubSub";
import dotenv from 'dotenv';
dotenv.config({ path: './src/.env' });

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
export async function processErrors(errors: any, options: ProcessErrorsOptions = {}): Promise<ErrorData[]> {
  const errorTypeMap = new Map<any, { level: string, name: string }>([
    [EvalError, { level: "Critical", name: "EvalError" }],
    [AggregateError, { level: "Critical", name: "AggregateError" }],
    [RangeError, { level: "High", name: "RangeError" }],
    [ReferenceError, { level: "High", name: "ReferenceError" }],
    [SyntaxError, { level: "Medium", name: "SyntaxError" }],
    [TypeError, { level: "Medium", name: "TypeError" }],
    [URIError, { level: "Low", name: "URIError" }],
    [Error, { level: "Medium", name: "Error" }],
  ]);

  // S'assurer que les erreurs sont itérables
  const errorList = (errors && errors.error) ? [errors.error] : (Array.isArray(errors) ? errors : Object.values(errors));

  return Promise.all(errorList.map(async (error: any) => {
    const errorConstructor = error && error.constructor ? error.constructor : Error;
    const { level, name } = errorTypeMap.get(errorConstructor) || { level: "Unknown", name: "UnknownError" };

    const message = error.message || String(error);
    const stack = error.stack || null;
    const context = options.context || {};

    const errorData = new ErrorData(level, message, name, stack, context);

    // Sauvegarde asynchrone (ne bloque pas le retour)
    saveAlert(errorData).catch(err => console.error("Failed to save alert:", err));

    if (options.api) {
      sendToApi(options.api.url, errorData);
    }

    if (options.pubsub) {
      // Note: subscribeToChannel semble être pour écouter, pas nécessaire ici pour publier
      // subscribeToChannel(options.pubsub.channel); 
      publishToChannel(options.pubsub.channel, errorData).catch(err => console.error("Failed to publish alert:", err));
    }

    return errorData;
  }));
}

/**
 * Gère les erreurs non capturées et termine le processus en cas d'erreur, sauf si l'option 'doNotCrash' est définie à true.
 *
 * @param handler - Le gestionnaire d'erreurs personnalisé à exécuter.
 * @param options - Un objet contenant les options de gestion des erreurs.
 * @returns - Un objet avec la fonction report pour signaler manuellement les erreurs.
 */
export function errorHandler(handler: (error: any, context: any) => void, options: ErrorHandlerOptions = {}): { report: (error: any, context: any) => void } {
  function handleError(error: any, context: any) {
    handler(error, context);

    if (options.NoCrash !== true) {
      process.exit(1);
    }
  }

  let rejectionEmitter = unhandled();

  rejectionEmitter.on("unhandledRejection", (error: any, promise: Promise<any>) => {
    handleError(error, {
      promise: promise,
      type: 'unhandledRejection'
    });
  });

  process.on("uncaughtException", (error: any) => {
    handleError(error, {
      type: 'uncaughtException'
    });
  });

  return {
    report: function reportError(error: any, context: any) {
      handleError(error, context);
    }
  };
}
