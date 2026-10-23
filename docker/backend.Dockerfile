FROM node:22-alpine AS production
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/src ./src
USER node
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost:4000/health || exit 1
CMD ["node", "src/server.js"]

