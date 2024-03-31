FROM node:lts-alpine

WORKDIR /app/
COPY package*.json ./
RUN npm install
RUN mkdir -p /app/
COPY . /app/

EXPOSE 3000
CMD ["node", "index.js"]