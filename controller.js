var path = require('path')
var bcrypt = require('bcrypt')
var jwt = require("jsonwebtoken");
var salt = 10;
const mongoose = require('mongoose');
const { use } = require('./router');
const { ObjectId } = require('mongodb');
const res = require('express/lib/response');
const { redirect } = require('express/lib/response');


mongoose.connect('mongodb+srv://root:Root1194@cluster0.knk2u.mongodb.net/data?retryWrites=true&w=majority');
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
        if(err) return res.redirect('/signup?error='+ encodeURIComponent('Something Wrong!'))
        if(user) return res.redirect('/signup?error=' + encodeURIComponent('Email Already Exists! Please Login'))
   

        db.collection('users').insertOne(data, (err, collection) => {
            if(err) return res.status(401).send("Error While Registration")
            res.redirect('/login')
        })
    })
}

const login = (req, res) => {
    console.log(req.body)
   db.collection('users').findOne({"email": req.body.email}, (err, user) => {
       if(err) return res.redirect('/login?error=' + encodeURIComponent('Invalid Login'))
       if(!user) return res.redirect('/login?error=' + encodeURIComponent('User Doesnt Exist! Please Make An Account'))
       if(!bcrypt.compareSync(req.body.password, user.password)) return res.redirect('/login?error=' + encodeURIComponent('Password Incorrect'))
       var token = jwt.sign({
           id:  user._id
       },"SECRET_KEY",{
           expiresIn: 86400
       }
       );
       res.cookie('auth',token);
       res.redirect('/')
   })
}

const validator = (req, res, next) => {
    if(!req.body.email || !req.body.password) {
        if(req.path == "/login") return res.redirect("/login?error="+ "Please Fill All The Details");
        else return res.redirect("/signup?error="+ "Please Fill All The Details");
    }
    next()
}

const stats = async (req, res) => {
    if(!req.user) return res.status(403).send("Unauthorized access")
    if(!req.body.connections && !req.body.comments && !req.body.dms && !req.body.redditDms) return res.status(400).send("Bad Request")

    var connections = parseInt(req.body.connections);
    var comments = parseInt(req.body.comments);
    var dms = parseInt(req.body.dms);

    var redditComments = parseInt(req.body.redditComments);
    var redditDms = parseInt(req.body.redditDms);

    var user = await db.collection('stats').findOne({userid: req.user._id});
    if(!user){
      user = await db.collection('stats').insertOne({userid: req.user._id, connections: 0, comments: 0, redditComments: 0, redditDms: 0,dms: 0});
    }
    if(connections) user.connections = connections + parseInt(user.connections || 0);
    if(comments) user.comments = comments + parseInt(user.comments || 0 );
    if(dms) user.dms =  dms + parseInt(user.dms || 0);

    if(redditComments) user.redditComments =  redditComments + parseInt(user.redditComments || 0);
    if(redditDms) user.redditDms =  redditDms + parseInt(user.redditDms || 0);


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

const verifyAuth = (req, res, next) => {
    var token = req.cookies.auth;
    if (token) {
      jwt.verify(token, 'SECRET_KEY', function(err, token_data) {
          if(req.path == "/login" || req.path == "/signup") return res.redirect('/')
            db.collection("users").findOne({_id: ObjectId(token_data.id)}, (err, user) => {
                if(err)  req.user = undefined;
                req.user = user
                next();
                });
      });
    } else {
        if(req.path == "/") return res.redirect('/login');
         next()
    }
}

const signOut = (req, res, next) => {
    res.cookie('auth', '', {expires: new Date(0)});
    res.redirect('/login')
}

const dashboard = (req, res, next) => {
    db.collection("stats").findOne({userid: ObjectId(req.user._id)}, (err, user) => {
        res.redirect('/dashboard?redditM='+user.redditDms+"&connections="+user.connections+"&comments="+user.comments+"&dms="+user.dms)
    });
}

module.exports = {register, login, validator, stats, verifyToken, verifyAuth, signOut, dashboard}