var express = require('express');
var app = express();
const http = require('http');
// var router = require('./router.js');
var bodyparsera = require('body-parser')
const cookieParser = require("cookie-parser");

const normalizePort = val => {
   const port = parseInt(val, 10);
 
   if (isNaN(port)) {
     return val;
   }
   if (port >= 0) {
     return port;
   }
   return false;
 };

 const port = normalizePort(process.env.PORT || '3000');
 app.set('port', port);

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

// app.use('/', router);

// app.listen(3000, (port) => {
//    console.log("App Is Listening")
// });
const server = http.createServer(app);
server.listen(port);

server.on('listening', () => {
   const address = server.address();
   const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
   console.log('Listening on ' + bind);
 });