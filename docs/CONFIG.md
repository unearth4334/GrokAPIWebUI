# Configuration Scheme

This app uses a split settings model:

- UI settings are stored client-side in IndexedDB.
- API credentials are stored server-side in a database and must be encrypted at rest.

The settings popover edits UI settings only. API keys are managed via a server API and never persisted in the browser.

## UI settings

Schema: src/config/settings.schema.json
Defaults: src/config/defaults.json
Storage: IndexedDB (database: grok-ui, store: settings, key: ui)

Fields:

- version: schema version, integer
- theme: light | dark | system
- thumbnailSize: integer, 64..256
- updatedAt: ISO-8601 timestamp
- activeCredentialId: string or null (server-side credential reference)

## API credentials

Store credentials in the server DB with encryption at rest. UI should only send API keys to the server over TLS.
Do not store plaintext API keys anywhere on disk.

Suggested server record shape:

- id: string
- label: string
- encryptedApiKey: string
- createdAt: ISO-8601
- updatedAt: ISO-8601

## Popover behavior

- Load UI settings from IndexedDB on app start.
- Render settings in the popover and save changes on submit.
- Use activeCredentialId to choose which server-stored API key is active.
