
FROM node:14.17-alpine

WORKDIR /frontend

COPY package.json /frontend
COPY yarn.lock /frontend

RUN yarn

COPY . /frontend

# ENV TSC_WATCHFILE "UseFsEventsWithFallbackDynamicPolling"
CMD ["yarn", "start"]