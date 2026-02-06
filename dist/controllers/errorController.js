"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processErrors = processErrors;
exports.errorHandler = errorHandler;
const alertService_1 = require("../services/alertService");
const errorModel_1 = require("../models/errorModel");
const unhandled_rejection_1 = __importDefault(require("unhandled-rejection"));
const apiService_1 = __importDefault(require("../services/apiService"));
const pubSub_1 = require("./pubSub");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './src/.env' });
/**
 * Traite les erreurs fournies en utilisant les options spécifiées.
 *
 * @param errors - Un objet ou une erreur à traiter.
 * @param options - Un objet contenant les options de traitement des erreurs.
 * @returns - Une Promesse résolue avec le tableau des ErrorData traités.
 */
async function processErrors(errors, options = {}) {
    const errorTypeMap = new Map([
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
    return Promise.all(errorList.map(async (error) => {
        const errorConstructor = error && error.constructor ? error.constructor : Error;
        const { level, name } = errorTypeMap.get(errorConstructor) || { level: "Unknown", name: "UnknownError" };
        const message = error.message || String(error);
        const stack = error.stack || null;
        const context = options.context || {};
        const errorData = new errorModel_1.ErrorData(level, message, name, stack, context);
        // Sauvegarde asynchrone (ne bloque pas le retour)
        (0, alertService_1.saveAlert)(errorData).catch(err => console.error("Failed to save alert:", err));
        if (options.api) {
            (0, apiService_1.default)(options.api.url, errorData);
        }
        if (options.pubsub) {
            // Note: subscribeToChannel semble être pour écouter, pas nécessaire ici pour publier
            // subscribeToChannel(options.pubsub.channel); 
            (0, pubSub_1.publishToChannel)(options.pubsub.channel, errorData).catch(err => console.error("Failed to publish alert:", err));
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
function errorHandler(handler, options = {}) {
    function handleError(error, context) {
        handler(error, context);
        if (options.NoCrash !== true) {
            process.exit(1);
        }
    }
    let rejectionEmitter = (0, unhandled_rejection_1.default)();
    rejectionEmitter.on("unhandledRejection", (error, promise) => {
        handleError(error, {
            promise: promise,
            type: 'unhandledRejection'
        });
    });
    process.on("uncaughtException", (error) => {
        handleError(error, {
            type: 'uncaughtException'
        });
    });
    return {
        report: function reportError(error, context) {
            handleError(error, context);
        }
    };
}
