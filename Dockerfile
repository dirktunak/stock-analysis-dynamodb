FROM node:12.2.0-alpine
WORKDIR /app

COPY package.json /app/package.json
RUN npm install --silent
COPY . /app 
EXPOSE 3000

ENTRYPOINT node src/express/server.js
