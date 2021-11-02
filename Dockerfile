FROM node:14.17.0

WORKDIR /app
COPY package.json /app
RUN npm install && npm cache clean --force
COPY . /app
CMD [ "npm", "run", "dev" ]