var express = require('Express');
var app = express();

var router = require('./router.js');

app.use('/', router);

app.listen(3000);