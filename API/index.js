var express = require('Express');
var app = express();
var router = require('./router.js');
var bodyparsera = require('body-parser')
   const cookieParser = require("cookie-parser");

app.use(bodyparsera.urlencoded({ extended: false }));
app.use(express.static('web/src'))
app.use(cookieParser());

app.use('/', router);

app.listen(3000, (port) => {
   console.log("App Is Listening")
});