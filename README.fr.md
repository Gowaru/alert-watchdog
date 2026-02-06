# Alert Watchdog

[![npm version](https://img.shields.io/npm/v/alert-watchdog.svg)](https://www.npmjs.com/package/alert-watchdog)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

**Alert Watchdog** est un module Node.js robuste conçu pour la surveillance d'événements et la gestion centralisée des alertes. Il agit comme un garde-fou contre les exceptions non gérées et garantit que les erreurs critiques sont capturées, validées et persistées pour analyse.

[🇺🇸 Read the documentation in English](README.md)

## Fonctionnalités Clés

*   **Prévention des Crashs** : Capture automatiquement les `uncaughtException` et `unhandledRejection` pour éviter l'arrêt brutal du processus (configurable).
*   **Stockage Fiable** : Persiste les alertes dans **Redis** via des listes (`RPUSH`), assurant un historique fiable et un traitement FIFO.
*   **Validation Configurable** : Des schémas **Zod** intégrés garantissent l'intégrité des données de configuration et d'alerte au moment de l'exécution.
*   **TypeScript First** : Écrit en TypeScript strict, offrant des définitions de types complètes et une autocomplétion IDE.
*   **Intégrations** :
    *   **Redis Pub/Sub** : Diffusion d'alertes en temps réel.
    *   **Webhooks HTTP** : Transfert d'alertes vers des API externes (Slack, Discord, monitoring personnalisé).

---

## Installation

```bash
npm install alert-watchdog
```

> **Prérequis** : Une instance Redis en cours d'exécution (version 4+ recommandée).

---

## Démarrage Rapide

### 1. TypeScript / ES Modules (Recommandé)

```typescript
import { init, catchError } from 'alert-watchdog';

// 1. Initialiser le watchdog au démarrage de l'application
await init({
  redis: {
    host: '127.0.0.1',
    port: 6379,
    password: process.env.REDIS_PASSWORD
  }
});

// 2. Sécuriser les opérations à risque
await catchError(async () => {
  // Votre logique métier susceptible d'échouer
  await database.connect();
}, {
  context: { service: 'payment-service', operation: 'connect' }
});
```

### 2. CommonJS

```javascript
const { init, catchError } = require('alert-watchdog');

init().then(() => {
  console.log('Watchdog initialisé');
});
```

---

## Configuration

Vous pouvez configurer `alert-watchdog` via la fonction `init()` ou via des variables d'environnement (conforme Twelve-Factor App).

### Variables d'Environnement

Créez un fichier `.env` à la racine de votre projet :

| Variable | Description | Défaut |
| :--- | :--- | :--- |
| `ALERT_WATCHDOG_REDIS_CONFIG_ENABLED` | Activer stockage Redis | `true` |
| `ALERT_WATCHDOG_REDIS_HOST` | Hôte Serveur Redis | `127.0.0.1` |
| `ALERT_WATCHDOG_REDIS_PORT` | Port Serveur Redis | `6379` |
| `ALERT_WATCHDOG_REDIS_PASSWORD` | Mot de passe Redis | `` |
| `ALERT_WATCHDOG_LOG_ENABLED` | Activer logs fichiers locaux | `true` |
| `ALERT_WATCHDOG_LOG_PATH` | Chemin des fichiers logs | `./logs/alert-watchdog` |
| `ALERT_WATCHDOG_API_URL_ENABLE` | Activer Webhook HTTP | `false` |
| `ALERT_WATCHDOG_API_URL` | URL du Webhook | `` |

Voir [.env.example](.env.example) pour un modèle complet.

---

## Référence API

### `init(config)`
Initialise le client Redis interne et la configuration.
*   `config`: (Optionnel) Objet contenant les paramètres Redis. Validé par Zod.

### `catchError(callback, options)`
Enveloppe l'exécution d'une fonction pour capturer et traiter les erreurs.
*   `callback`: Fonction synchrone ou asynchrone à exécuter.
*   `options`:
    *   `context`: Paires clé-valeur pour ajouter des métadonnées à l'erreur.
    *   `pubsub`: `{ channel: string }` pour publier sur un canal Redis spécifique.
    *   `api`: `{ url: string }` pour surcharger l'URL du webhook.

### `errorHandler(handler, options)`
Configure un piège global pour les exceptions non gérées.
*   `handler`: Fonction de rappel `(error, context) => void`.
*   `options`:
    *   `NoCrash`: `boolean` (Défaut : `false`). Si `true`, le processus ne se terminera **PAS** après une exception non gérée. **Déconseillé en production.**

---

## Développement & Bonnes Pratiques

### Workflow
Ce projet utilise **TypeScript** et **Standard Version** pour la gestion des releases.

```bash
# Installer les dépendances
npm install

# Compiler le projet (TypeScript -> JavaScript dans dist/)
npm run build

# Lancer les tests de vérification
npm run build && node test_verification.js

# Créer une nouvelle version (Bump version, maj Changelog, création Tag)
npm run release
```

### Notes d'Architecture
*   **Pattern Singleton** : La connexion Redis est gérée comme un singleton pour éviter l'épuisement des connexions.
*   **Validation** : Toutes les entrées sont nettoyées via des schémas Zod (`src/models/`).
*   **Logs** : Utilise `winston` pour la rotation journalière des fichiers de logs.

---

## Licence
ISC
