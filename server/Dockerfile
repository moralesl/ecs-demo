# Base image
FROM node:15

WORKDIR /src/api

COPY package-lock.json ./
COPY package.json ./

RUN npm ci

COPY . .

EXPOSE 8080
CMD ["node", "server.js"]
