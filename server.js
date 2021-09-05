const express = require ('express');
const bodyParser =require ('body-parser');
const userRoute= require('./routes/user');
const uploadRoute = require('./controller/upload');
require('dotenv').config();
const User=require('./models/User');

require('./passport-social/twitter');
require('./passport-social/linkedin');
const mongoose=require('mongoose');
const path = require('path');
const session = require('express-session');
var cookieParser = require('cookie-parser');

const cookieSession = require('cookie-session');


const app=express();
require('dotenv').config()
var cors = require('cors');
app.use(cors())


/*
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,

}))
*/


const uri = "mongodb+srv://imateco:Im@t3k0T3st$!@imatecodatabasecluster.q3tic.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true}  ,()=>console.log('connected'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/api/user', userRoute);
app.use('/api/upload', uploadRoute);
/*
app.use(express.static(path.join(__dirname, 'public')));

*/

app.use(express.static(path.join(__dirname, 'public')));

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys:['qsdsdqdshqjkdjsqldkjsqlkdjsqlkdjsqlkdjlkqsdj']
}))
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/linkedin',
    passport.authenticate('linkedin', { state: 'SOME STATE'  }),
    function(req, res){
        // The request will be redirected to LinkedIn for authentication, so this
        // function will not be called.
    });

app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: '/login' }),
    async function(req, res) {
        // Successful authentication, redirect home.
        const user = {
            firstName: req.user.name.givenName,
            lastName: req.user.name.familyName,
            email: req.user.emails[0].value,
            avatarLink: req.user.photos[3].value,
            linkedin:true,
            inscription:true
        }

        user2= await User.findOne({email:req.user.emails[0].value})
        if (user2){

            res.status(200).json(user2)

        }
        else {

            const string = encodeURIComponent(JSON.stringify(user));

            res.status(200).json(user);
        }

    });
app.get('/auth/twitter/callback',
    passport.authenticate('twitter'),async (req,res)=>{
    const user = {
        firstName: req.user.username,
        lastName: '',
        email: req.user.emails[0].value,
        avatarLink: req.user.photos[0].value,
        twitterUsername: req.user.username,
        inscription:true
    }
    console.log(req.user);
    user2= await User.findOne({email:req.user.emails[0].value})
        if (user2){
            const string = encodeURIComponent(JSON.stringify(user2));
            res.status(200).json(user2)

        }
        else {

            const string = encodeURIComponent(JSON.stringify(user));
            /*res.redirect(`${process.env.HOST}/signup/?user=${string}`)*/

            res.status(200).json(user);
        }

    });

app.listen(3000)
