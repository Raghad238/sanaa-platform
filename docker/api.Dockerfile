FROM node:22-bookworm-slim

WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @sanaa-platform/database db:generate

EXPOSE 4000

CMD ["sh", "-c", "pnpm --filter @sanaa-platform/database db:migrate:deploy && pnpm --filter @sanaa-platform/api dev"]