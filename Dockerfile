FROM node:lts-alpine

WORKDIR /app/
COPY package*.json ./
RUN npm install

COPY . . # Copy all files from the current directory to the /app/

EXPOSE 3000
CMD ["node", "index.js"]