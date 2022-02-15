var express = require('express');
var app = express();
var router = require('./router.js');
var bodyparsera = require('body-parser')
const cookieParser = require("cookie-parser");

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

app.use('/', router);

app.listen(3000, (port) => {
   console.log("App Is Listening")
});