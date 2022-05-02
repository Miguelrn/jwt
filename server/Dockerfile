FROM node:14.17-alpine

WORKDIR /backend

COPY package.json /backend
COPY yarn.lock /backend

RUN yarn

COPY . /backend

# ENV TSC_WATCHFILE "UseFsEventsWithFallbackDynamicPolling"
CMD ["yarn", "start"]
