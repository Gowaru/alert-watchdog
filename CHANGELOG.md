# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.3] (2026-02-06)

### Added
-   **TypeScript**: Complete migration of the codebase to TypeScript.
-   **Zod**: Integration of Zod for runtime data validation (config, models, inputs).
-   **Build System**: Added `npm run build` script using `tsc`.
-   **Types**: Automatic generation of `dist/index.d.ts` for better IDE support.
-   `CHANGELOG.md` file to track project history.

### Changed
-   **Structure**: Source code moved to `src/` and entry point refactored to `src/index.ts`.
-   **Configuration**: Redis configuration is now validated at startup; invalid config throws errors.
-   **Storage**: Alerts are now stored in a Redis List (`alerts`) instead of simple keys, preserving history.
-   **API**: `init()` function now accepts a typed configuration object.

### Removed
-   Manual `index.d.ts` file (replaced by auto-generated types).
-   `app.js` (replaced by `src/index.ts`).
