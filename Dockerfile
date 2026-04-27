FROM ghcr.io/puppeteer/puppeteer:latest

# Use the pre-installed Chrome in the Puppeteer image
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the server code
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
