var path = require('path')
var bcrypt = require('bcrypt')
var jwt = require("jsonwebtoken");
var salt = 10;
const mongoose = require('mongoose');
const { use } = require('./router');
const { ObjectId } = require('mongodb');
const res = require('express/lib/response');
const { redirect } = require('express/lib/response');


// mongoose.connect('mongodb+srv://root:Root1194@cluster0.knk2u.mongodb.net/data?retryWrites=true&w=majority');
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
    // if(!req.body.connections && !req.body.comments && !req.body.dms && !req.body.redditDms) return res.status(400).send("Bad Request")

    var name = req.body.name;
    var href = req.body.href;
    var title = req.body.title;
    var country = req.body.country;
    var niche = req.body.niche;

    var subreddit = req.body.subreddit;

    var user = await db.collection('stats').findOne({userid: req.user._id});
    if(!user){
      await db.collection('stats').insertOne({userid: req.user._id, rows: [], rowsR: [] });
      user = await db.collection('stats').findOne({userid: req.user._id});
    }
    var rows = user.rows;
    var rowsR = user.rowsR;
    if(name && href && title && country && niche){
        rows.push({
            name: name,
            profile: href,
            title: title,
            country: country,
            niche: niche,
            Date:  Date.now()
        })
        user.rows = rows
    }else{
        rowsR.push({
            name: name,
            href: href,
            subreddit: subreddit,
            Date:  Date.now()
        })
        user.rowsR = rowsR
    }


    db.collection('stats').updateOne({userid: req.user._id}, {$set:user}, (err, data) => {
        if(err) console.log(err)
        res.status(200).send("Done");
    })    

}

const verifyToken = (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], "SECRET_KEY", function (err, decode) {
          if (err) {
            console.log(err)
              return res.status(403).send(err)}

            db.collection("users").findOne({_id: ObjectId(decode.id)}, (err, user) => {
                if(err)  req.user = undefined;
                req.user = user
                console.log(decode.id)
        console.log("HIOa1")

                next();
            });
        });
      } else {
        req.user = undefined;
        console.log("HIOa")

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
    // console.log(req.user)
    // db.collection("stats").findOne({userid: ObjectId(req.user._id)}, (err, user) => {
    //     if(!user) return res.redirect('/dashboard?redditM='+0+"&connections="+0+"&comments="+0+"&dms="+0)
    //     res.redirect('/dashboard?redditM='+user.redditDms+"&connections="+user.connections+"&comments="+user.comments+"&dms="+user.dms)
    // });
}

const table = (req, res, next) => {
    if(!req.query.platform) var platform = "LinkedIn";
    else var platform = req.query.platform; 
    res.sendFile(path.join(__dirname+'/web/table.html'))
}

const getStats = async (req, res) => {
    if(!req.user) return res.status(403).send("Unauthorized access")
    var user = await db.collection('stats').findOne({userid: req.user._id});
    if(!user){
      await db.collection('stats').insertOne({userid: req.user._id, rows: [{profile: "Amir Alam", Company: "TheDexk", Designation:"CEO", Date: "14 Feb 2020"}], comments: 0, redditComments: 0, redditDms: 0,dms: 0});
       user = await db.collection('stats').findOne({userid: req.user._id});  
    }
    res.json(user)
}

module.exports = {register, login, validator, stats, verifyToken, verifyAuth, signOut, dashboard, table, getStats}