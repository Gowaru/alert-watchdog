"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sendToApi;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './src/.env' });
function sendToApi(apiUrl, err) {
    const apiUrlEnabled = process.env.ALERT_WATCHDOG_API_URL_ENABLE === 'false' ? false : true;
    // Envoyer les données à l'API en utilisant fetch
    if (!apiUrlEnabled) {
        // process.env.ALERT_WATCHDOG_API_URL = undefined; // Avoid mutating process.env if possible
    }
    else {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(err),
        })
            .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de l'envoi des données à l'API");
            }
            return response.json();
        })
            .then(data => {
            console.log("Réponse de l'API: ", data);
        })
            .catch(error => {
            console.error("Une erreur est survenue: ", error);
        });
    }
}
