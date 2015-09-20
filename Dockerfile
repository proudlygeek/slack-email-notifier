FROM node:0.12.4

RUN mkdir /src

RUN npm install nodemon -g
  
WORKDIR /src

ADD ./app /src/
RUN npm install

EXPOSE 25

CMD npm start