FROM node:18

RUN mkdir /cantantebanquillo_app
COPY /audio /cantantebanquillo_app
COPY /img /cantantebanquillo_app
COPY bot.js /cantantebanquillo_app
COPY commands.js /cantantebanquillo_app
COPY config.json /cantantebanquillo_app
COPY disc_client.js /cantantebanquillo_app
COPY package.json /cantantebanquillo_app

WORKDIR /cantantebanquillo_app

RUN npm install

CMD node bot.js 