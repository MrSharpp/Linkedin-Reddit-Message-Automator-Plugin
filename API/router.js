var express = require('express');
var router = express.Router();
var controller = require('./controller');

router.post('/register', controller.validator ,controller.register);
router.post('/login', controller.validator ,controller.login);
router.post('/stats', controller.verifyToken ,controller.stats);

module.exports = router;