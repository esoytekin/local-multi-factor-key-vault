FROM node:9-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY app app

ENTRYPOINT ["npm","start"]
