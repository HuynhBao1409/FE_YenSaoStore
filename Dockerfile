FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

RUN rm -rf node_modules package-lock.json && npm i
RUN npm ci --legacy-peer-deps

COPY .env.dev .env

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3016

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env.dev .env

EXPOSE 3016

CMD ["npm", "start"]
