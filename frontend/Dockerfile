FROM node:16.16.0-alpine
WORKDIR /usr/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build
