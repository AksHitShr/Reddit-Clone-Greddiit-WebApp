FROM node:18.12.1
WORKDIR /backend 

COPY package.json .

RUN npm install 

COPY . .

EXPOSE 3500

CMD [ "node" , "app.js" ]