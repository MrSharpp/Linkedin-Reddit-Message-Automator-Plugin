var express = require('express');
var router = express.Router();
var controller = require('./controller');
var path = require('path')

router.post('/register', controller.validator ,controller.register);
router.post('/login', controller.validator ,controller.login);
router.post('/stats', controller.verifyToken ,controller.stats);

router.get('/', controller.verifyAuth ,controller.dashboard);

router.get('/dashboard', controller.verifyAuth , (req, res) => {
    res.sendFile(path.join(__dirname+'/web/dashboard.html'))
});


router.get('/login', controller.verifyAuth,(req, res) => {
    res.sendFile(path.join(__dirname+'/web/login.html'))
});

router.get('/signup',controller.verifyAuth, (req, res) => {
    res.sendFile(path.join(__dirname+'/web/signup.html'))
});

router.get('/signout', controller.signOut);

module.exports = router;