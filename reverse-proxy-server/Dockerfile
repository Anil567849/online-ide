FROM node:alpine3.10

WORKDIR /home/app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install typescript

RUN npm install

COPY src ./src

CMD ["npm", "run", "dev"]
