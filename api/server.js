import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

/* eslint no-console: off */

let app = express();
let server = http.Server(app);

app.use(bodyParser.json());       // to support JSON-encoded bodies

const serverPort = 8010;

server.listen(serverPort, 'localhost');
console.log(`Server is up and running on localhost:${serverPort}`);

app.get('/pizzas', function (req, res) {
  console.log('GET /pizzas');
  res.status(200);
  res.send([
    { id: 1, name: 'Pizza 1', price: '$2.99', toppings: ['pepperoni', 'tomatos'] },
    { id: 2, name: 'Pizza 2', price: '$0.99' },
    { id: 3, name: 'Pizza 3', price: '$1.99', toppings: ['tomatos'] },
  ]);
});
