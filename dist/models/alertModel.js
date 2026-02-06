"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alert = exports.AlertSchema = void 0;
const zod_1 = require("zod");
exports.AlertSchema = zod_1.z.object({
    name: zod_1.z.string().default(""),
    message: zod_1.z.string().default(""),
    level: zod_1.z.string().default(""),
    timestamp: zod_1.z.string().optional()
});
/**
 * @class Alert
 * @classdesc Classe représentant une alerte.
 */
class Alert {
    /**
     * Crée une instance d'Alerte.
     * @param alertData - Les données de l'alerte.
     */
    constructor(alertData) {
        const parsed = exports.AlertSchema.parse(alertData);
        this.name = parsed.name;
        this.message = parsed.message;
        this.level = parsed.level;
        this.timestamp = new Date().toISOString().replace("T", " ").replace("Z", "");
    }
}
exports.Alert = Alert;
