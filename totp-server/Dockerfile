FROM node:9-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY src src
COPY schema schema
COPY server.js .

ENTRYPOINT ["npm","start"]
