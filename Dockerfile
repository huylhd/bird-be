FROM node:14-alpine
WORKDIR /bird-be
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
EXPOSE 3000
CMD [ "node", "dist/main.js" ]
