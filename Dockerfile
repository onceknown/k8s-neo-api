FROM gcr.io/api-dannydavidson-com/node:latest

RUN mkdir -p /src
WORKDIR /src

RUN npm install -g nodemon

ADD package.json ./package.json
RUN npm install

# Bundle app source
ADD . .

EXPOSE 11235
EXPOSE 8080

CMD ["node", "app/server.js"]
