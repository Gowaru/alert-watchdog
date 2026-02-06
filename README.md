# Alert Watchdog

[![npm version](https://img.shields.io/npm/v/alert-watchdog.svg)](https://www.npmjs.com/package/alert-watchdog)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

**Alert Watchdog** is a robust Node.js module designed for event monitoring and centralized alert management. It provides a safeguard against unhandled exceptions and ensures critical errors are captured, validated, and persisted for analysis.

[🇫🇷 Lire la documentation en Français](README.fr.md)

## 🚀 Key Features

*   **🛡️ Crash Prevention**: Automatically captures `uncaughtException` and `unhandledRejection` to prevent process crashes (configurable).
*   **💾 Reliable Storage**: Persists alerts in **Redis** using Lists (`RPUSH`), ensuring reliable history and FIFO processing.
*   **✅ Configurable Validation**: Integrated **Zod** schemas ensure data integrity for configuration and alerts at runtime.
*   **📘 TypeScript First**: Written in strict TypeScript, providing comprehensive type definitions and IDE autocompletion.
*   **🔌 Integrations**:
    *   **Redis Pub/Sub**: Real-time alert broadcasting.
    *   **HTTP Webhooks**: Forward alerts to external APIs (Slack, Discord, custom monitoring).

---

## 📦 Installation

```bash
npm install alert-watchdog
```

> **Prerequisite**: A running Redis instance (version 4+ recommended).

---

## 🏁 Quick Start

### 1. TypeScript / ES Modules (Recommended)

```typescript
import { init, catchError } from 'alert-watchdog';

// 1. Initialize the watchdog at application startup
await init({
  redis: {
    host: '127.0.0.1',
    port: 6379,
    password: process.env.REDIS_PASSWORD
  }
});

// 2. Wrap risky operations
await catchError(async () => {
  // Your business logic that might fail
  await database.connect();
}, {
  context: { service: 'payment-service', operation: 'connect' }
});
```

### 2. CommonJS

```javascript
const { init, catchError } = require('alert-watchdog');

init().then(() => {
  console.log('Watchdog initialized');
});
```

---

## ⚙️ Configuration

You can configure `alert-watchdog` via the `init()` function or Environment Variables (Twelve-Factor App compliant).

### Environment Variables

Create a `.env` file in your project root:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `ALERT_WATCHDOG_REDIS_CONFIG_ENABLED` | Enable Redis storage | `true` |
| `ALERT_WATCHDOG_REDIS_HOST` | Redis Server Host | `127.0.0.1` |
| `ALERT_WATCHDOG_REDIS_PORT` | Redis Server Port | `6379` |
| `ALERT_WATCHDOG_REDIS_PASSWORD` | Redis Password | `` |
| `ALERT_WATCHDOG_LOG_ENABLED` | Enable local file logging | `true` |
| `ALERT_WATCHDOG_LOG_PATH` | Path for log files | `./logs/alert-watchdog` |
| `ALERT_WATCHDOG_API_URL_ENABLE` | Enable HTTP Webhook | `false` |
| `ALERT_WATCHDOG_API_URL` | Webhook Endpoint URL | `` |

See [.env.example](.env.example) for a complete template.

---

## 📚 API Reference

### `init(config)`
Initializes the internal Redis client and configuration.
*   `config`: (Optional) Object containing Redis settings. Validated by Zod.

### `catchError(callback, options)`
Wraps a function execution to catch and handle errors.
*   `callback`: Async or sync function to execute.
*   `options`:
    *   `context`: Key-value pairs to add metadata to the error.
    *   `pubsub`: `{ channel: string }` to publish to a specific Redis channel.
    *   `api`: `{ url: string }` to override valid webhook URL.

### `errorHandler(handler, options)`
Sets up a global trap for unhandled exceptions.
*   `handler`: Callback function `(error, context) => void`.
*   `options`:
    *   `NoCrash`: `boolean` (Default: `false`). If `true`, the process will **NOT** exit after an unhandled exception. **Not recommended for production.**

---

## 🛠️ Development & Best Practices

### Workflow
This project uses **TypeScript** and **Standard Version** for release management.

```bash
# Install dependencies
npm install

# Build the project (TypeScript -> JavaScript in dist/)
npm run build

# Run verification tests
npm run build && node test_verification.js

# Release a new version (Bump version, update Changelog, create Tag)
npm run release
```

### Architecture Notes
*   **Singleton Pattern**: The Redis connection is managed as a singleton to avoid connection exhaustion.
*   **Validation**: All inputs are sanitized using Zod schemas (`src/models/`).
*   **Logs**: Uses `winston` for daily rotating log files.

---

## 📄 License
ISC
