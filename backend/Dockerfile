FROM node:16.16.0-alpine
WORKDIR /usr/app
COPY backend/package*.json /usr/app
RUN npm install --quiet
COPY backend /usr/app
CMD [ "node", "new.js" ]