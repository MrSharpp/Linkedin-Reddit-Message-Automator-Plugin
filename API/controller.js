var path = require('path')
var bcrypt = require('bcrypt')
var jwt = require("jsonwebtoken");
var salt = 10;
const mongoose = require('mongoose');
const { use } = require('./router');
const { ObjectId } = require('mongodb');
const res = require('express/lib/response');


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

    db.collection('users').findOne({"email": req.body.email}, (err, user) => {
        if(err) return res.status(401).send("Some Error")
        if(user) return res.status(409).send("User Already Exists")
   

        db.collection('users').insertOne(data, (err, collection) => {
            if(err) return res.status(401).send("Error While Registration")
            return res.status(200).send("Registration Successfull")
        })
    })
}

const login = (req, res) => {
   db.collection('users').findOne({"email": req.body.email}, (err, user) => {
       if(err) return res.status(401).send("Invalid Login")
       if(!bcrypt.compareSync(req.body.password, user.password)) return res.status(401).send("Invalid Login")
       var token = jwt.sign({
           id:  user._id
       },"SECRET_KEY",{
           expiresIn: 86400
       }
       );
       console.log(token)
       return res.status(200).send(token)
   })
}

const validator = (req, res, next) => {
    if(!req.body.email || !req.body.password) return res.status(400).send("Bad Request")
    next()
}

const stats = async (req, res) => {
    if(!req.user) return res.status(403).send("Unauthorized access")
    if(!req.body.connections && !req.body.comments && !req.body.dms) return res.status(400).send("Bad Request")

    var connections = parseInt(req.body.connections);
    var comments = parseInt(req.body.comments);
    var dms = parseInt(req.body.dms);
    var user = await db.collection('stats').findOne({userid: req.user._id});
    console.log(connections)
    if(!user){
      user = await db.collection('stats').insertOne({userid: req.user._id, connections: 0, comments: 0, dms: 0});
    }
    if(connections) user.connections = connections + parseInt(user.connections || 0);
    if(comments) user.comments = comments + parseInt(user.comments || 0 );
    if(dms) user.dms =  dms+ parseInt(user.dms || 0);


    db.collection('stats').updateOne({userid: req.user._id}, {$set:user}, (err, data) => {
        if(err) console.log(err)
        res.status(200).send("Done");
    })    

}

const verifyToken = (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], "SECRET_KEY", function (err, decode) {
          if (err)  req.user = undefined;
            db.collection("users").findOne({_id: ObjectId(decode.id)}, (err, user) => {
                if(err)  req.user = undefined;
                req.user = user
                next();
            });
        });
      } else {
        req.user = undefined;
        next();
      }
}

module.exports = {register, login, validator, stats, verifyToken}