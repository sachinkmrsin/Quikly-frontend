# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY . /app


# ── Builder ───────────────────────────────────────────────────────────────────
FROM base AS builder

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    rm -f pnpm-lock.yaml && pnpm install --ignore-scripts
RUN pnpm build


# ── Tester ────────────────────────────────────────────────────────────────────
FROM builder AS tester

RUN pnpm test && touch /tmp/tests-passed


# ── Runtime ───────────────────────────────────────────────────────────────────
FROM nginx:alpine AS runtime

COPY --from=tester /tmp/tests-passed /tmp/tests-passed
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
