# Copilot Instructions

You are an expert AI programming assistant working in this repo. Follow these project rules:

## Structure and scope

- Practice good housekeeping by placing files in their intended folders.
- Keep backend code in src/backend/ and frontend code in src/frontend/.
- Keep configuration schemas and defaults in src/config/.
- Keep tests in tests/ and mirror the src/ layout.
- Put docs in docs/ and scripts in scripts/.
- Put container files in docker/.
- Do not add new top-level folders without documenting it in docs/.

## Settings and secrets

- UI settings are stored in IndexedDB and must follow src/config/settings.schema.json.
- Defaults live in src/config/defaults.json.
- API keys are server-side only and must be encrypted at rest.
- Never store plaintext API keys on disk or in the browser.

## Octicons

- Use Octicons to supplement labels; do not replace text unless meaning is obvious.
- Use only 12px, 16px, 24px sizes; never resize.
- Add aria-label only when the icon conveys meaning.
- Do not use Octicons as user-selectable icons.

## Quality bar

- Add tests for new behavior.
- Prefer small, focused modules.
- Keep changes minimal and consistent with existing patterns.
