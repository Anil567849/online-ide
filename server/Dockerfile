FROM ubuntu

# Install necessary build tools and dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    python3

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -

RUN apt-get update

RUN apt-get upgrade -y

# Install Node.js
RUN apt-get install -y nodejs

WORKDIR /home/app

RUN mkdir user

COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install --save-dev @types/node

# Install TypeScript globally
RUN npm install typescript

RUN npm install

COPY src ./src

RUN npm run build