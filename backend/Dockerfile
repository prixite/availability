FROM node:16.16.0-alpine
WORKDIR /usr/app
COPY backend/package*.json ./
RUN npm ci
COPY backend ./

CMD [ "node", "new.js" ]