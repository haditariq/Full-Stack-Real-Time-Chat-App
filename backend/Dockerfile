FROM node
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN apt-get update && apt-get install -y npm nginx

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4999
CMD ["sh", "-c", "service nginx start && npm start"]
