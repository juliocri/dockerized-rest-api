FROM node

RUN mkdir /client
COPY ./src /client/src
COPY ./public /client/public
COPY ./package.json /client/package.json
COPY ./package-lock.json /client/package-lock.json
WORKDIR /client
RUN npm install -g react-scripts
RUN npm install

EXPOSE 3000
