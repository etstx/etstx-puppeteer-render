FROM ghcr.io/puppeteer/puppeteer:23.6.0

ENV puppeteer_skip_chromium_download=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/goggle-chrome=stable

WORKDIR usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "index.js"]
