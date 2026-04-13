FROM node:lts-alpine
WORKDIR /srv
COPY . .

RUN npm install && npm run build

ENTRYPOINT ["npm", "run", "start"]