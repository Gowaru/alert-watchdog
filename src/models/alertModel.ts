import { z } from 'zod';

export const AlertSchema = z.object({
  name: z.string().default(""),
  message: z.string().default(""),
  level: z.string().default(""),
  timestamp: z.string().optional()
});

export type AlertType = z.infer<typeof AlertSchema>;

/**
 * @class Alert
 * @classdesc Classe représentant une alerte.
 */
export class Alert {
  public name: string;
  public message: string;
  public level: string;
  public timestamp: string;

  /**
   * Crée une instance d'Alerte.
   * @param alertData - Les données de l'alerte.
   */
  constructor(alertData: { name?: string; message?: string; level?: string }) {
    const parsed = AlertSchema.parse(alertData);
    this.name = parsed.name;
    this.message = parsed.message;
    this.level = parsed.level;
    this.timestamp = new Date().toISOString().replace("T", " ").replace("Z", "");
  }
}
