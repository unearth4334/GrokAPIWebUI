# Project Instructions

This project is structured to keep the codebase tidy, extensible, and easy to test. Follow these rules when adding new work.

## Structure rules

- Keep application code under src/.
- Keep backend code under src/backend/.
- Keep frontend code under src/frontend/.
- Keep configuration modules and schemas under src/config/.
- Keep test code under tests/ and mirror the src/ layout.
- Put scripts used for local workflows in scripts/.
- Keep container-related files in docker/.
- Do not add new top-level folders without a clear reason and documented guidance.

## Secrets and credentials

- Never commit real credentials.
- Store local secrets in .env (not tracked by git).
- Use .env.example as the template for required variables.
- Prefer Docker secrets for production and CI.
- API keys must be stored encrypted at rest on the server side.

## App settings scheme

- UI settings live in IndexedDB and must follow src/config/settings.schema.json.
- Defaults are defined in src/config/defaults.json.
- Store API credentials on the server side only; never persist API keys in the browser.
- Use a settings popover to edit UI settings and persist them via the frontend settings storage.

## Testing and coverage

- All new features should include tests.
- Add unit tests and integration tests as appropriate.
- Maintain meaningful coverage; avoid empty or superficial tests.

## Workflow

- Start each feature on a dedicated feature branch.

## Docker guidance

- The app should run inside the Docker container defined in docker/Dockerfile.
- Use docker/compose.yaml for local development and testing.
- Keep runtime configuration via environment variables, not hard-coded values.

## Extensibility

- Keep modules small and focused.
- Avoid circular dependencies between src/ modules.
- Document any new architecture decisions in docs/.

## Octicons usage

- Use Octicons to supplement text labels, not replace them, unless the meaning is clear without text.
- Use the official sizes only: 12px, 16px, 24px; do not resize icons.
- Do not use Octicons as user-selectable icons; prefer emojis for user-selected iconography.
- If an icon conveys meaning, provide an aria-label; omit aria-label for decorative icons.
- Ensure icon color meets a 3:1 contrast ratio; prefer Primer functional foreground colors.
