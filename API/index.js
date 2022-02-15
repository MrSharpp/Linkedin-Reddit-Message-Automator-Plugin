var express = require('express');
var app = express();
// var router = require('./router.js');
var bodyparsera = require('body-parser')
const cookieParser = require("cookie-parser");
const http = require('http')
const hostname = '199.231.190.229';
const port = 3000;

   app.use(function (req, res, next) {

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,application/x-www-form-urlencoded');
      res.setHeader('Access-Control-Allow-Credentials', "true");
      res.setHeader('Access-Control-Allow-Headers', "authorization");

       
  
      next();
  });

app.use(bodyparsera.urlencoded({ extended: false }));
app.use(express.static('web/src'))
app.use(cookieParser());

app.use('/', (req, res) => {
   console.log("hello")
   res.send("JHELLO")
});

app.listen(3000, (port) => {
   console.log("App Is Listening")
});

// const server = http.createServer((req, res) => {
//    res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World! NodeJS \n');
// })

// server.listen(port, () => {
//    console.log(`Server running at http://${hostname}:${port}/`);
// })