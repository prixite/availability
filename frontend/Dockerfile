FROM node:16.16.0-alpine
WORKDIR /usr/frontend
COPY frontend ./
RUN npm ci && npm run build
