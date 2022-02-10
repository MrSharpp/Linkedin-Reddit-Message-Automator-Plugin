var path = require('path')
var bcrypt = require('bcrypt')
var salt = 10;
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/linkedin');
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
    console.log("connection succeeded");
})

const register = (req, res) => {
    var password = bcrypt.hashSync(req.body.password, salt);

    var data = {
        "email": req.body.email,
        "password": password
    }

    db.collection('users').insertOne(data, (err, collection) => {
        if(err) throw err;
        console.log("Record Added")
    })

    res.status(200).res.send("User Registered")
}

const login = (req, res) => {
   db.collection('users').findOne({"email": req.body.email}, (err, user) => {
       if(err) return res.status(401).send("Invalid Login")
       if(bcrypt.compareSync(req.body.password, user.password)) return res.status(401).send("Invalid Login")
       return res.status(200).send("Login Successfull")
   })
}

const validator = (req, res, next) => {
    if(!req.body.email || !req.body.password) return res.status(400).send("Bad Request")
    next()
}

module.exports = {register, login, validator}