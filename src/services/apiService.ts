import dotenv from 'dotenv';
dotenv.config({ path: './src/.env' });

export default function sendToApi(apiUrl: string, err: any): void {
  const apiUrlEnabled = process.env.ALERT_WATCHDOG_API_URL_ENABLE === 'false' ? false : true;
  // Envoyer les données à l'API en utilisant fetch
  if (!apiUrlEnabled) {
    // process.env.ALERT_WATCHDOG_API_URL = undefined; // Avoid mutating process.env if possible
  } else {
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
      })
  }
}