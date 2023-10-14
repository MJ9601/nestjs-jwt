FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json .

COPY yarn.lock .

RUN yarn install

RUN yarn build

RUN yarn start
