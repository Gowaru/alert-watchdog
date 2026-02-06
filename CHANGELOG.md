# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.3.5](https://github.com/Gowaru/alert-watchdog/compare/v1.3.4...v1.3.5) (2026-02-06)

### [1.3.4](https://github.com/Gowaru/alert-watchdog/compare/v1.3.3...v1.3.4) (2026-02-06)

### 1.3.3 (2026-02-06)

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
