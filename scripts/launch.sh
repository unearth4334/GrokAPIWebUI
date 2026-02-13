#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

if [[ ! -f .env ]]; then
  echo "Missing .env file. Copy .env.example to .env and fill in values." >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required but not installed." >&2
  exit 1
fi

if docker compose version >/dev/null 2>&1; then
  docker compose -f docker/compose.yaml up --build
else
  echo "docker compose plugin is required. Install Docker Compose." >&2
  exit 1
fi
