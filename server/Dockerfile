FROM node:14.17-alpine

WORKDIR /backend

COPY package.json /backend
COPY yarn.lock /backend

RUN yarn install

COPY . /backend
#COPY ormconfig.docker.json /backend/ormconfig.json

EXPOSE 3001
# ENV TSC_WATCHFILE "UseFsEventsWithFallbackDynamicPolling"
CMD ["yarn", "start"]