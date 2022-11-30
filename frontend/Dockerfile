FROM node:16.16.0-alpine
WORKDIR /usr/app
COPY backend/package*.json /usr/app
RUN npm install --quiet
COPY frontend /usr/app
RUN npm run build
CMD [ "npm", "start" ]