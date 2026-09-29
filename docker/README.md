# Local Docker development

1. Copy `.env.example` to `.env` and replace the local placeholder passwords.
2. Start both services from the repository root with `docker compose -f docker/compose.yaml up --build`.
3. Open `http://localhost:4000/api/v1/health` for API health and `http://localhost:4000/api/v1/health/db` for Prisma/MySQL connectivity.

Compose waits for MySQL's authenticated `SELECT 1` health check before starting the API. The API applies the existing Prisma migrations with `migrate deploy` before starting. It reaches MySQL at the Compose service hostname `mysql:3306`; from the host, the published MySQL port is `localhost:${MYSQL_PORT}`.

The named `mysql_data` volume preserves database files across container recreation. `docker compose -f docker/compose.yaml down` stops and removes containers without deleting this volume. Do not use `down --volumes` for normal development.

The local `DATABASE_URL` format is `mysql://USER:PASSWORD@mysql:3306/DATABASE_NAME`. Use the Compose service hostname `mysql` inside the API container, not `localhost`.
