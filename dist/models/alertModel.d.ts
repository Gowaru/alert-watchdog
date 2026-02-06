import { z } from 'zod';
export declare const AlertSchema: z.ZodObject<{
    name: z.ZodDefault<z.ZodString>;
    message: z.ZodDefault<z.ZodString>;
    level: z.ZodDefault<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AlertType = z.infer<typeof AlertSchema>;
/**
 * @class Alert
 * @classdesc Classe représentant une alerte.
 */
export declare class Alert {
    name: string;
    message: string;
    level: string;
    timestamp: string;
    /**
     * Crée une instance d'Alerte.
     * @param alertData - Les données de l'alerte.
     */
    constructor(alertData: {
        name?: string;
        message?: string;
        level?: string;
    });
}
