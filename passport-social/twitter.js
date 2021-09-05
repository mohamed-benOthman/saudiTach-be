const passport = require('passport');
const session = require('express-session');
const TwitterStrategy= require('passport-twitter').Strategy;
require('dotenv').config();
const User=require('../models/User')
var url = require('url');
const Window = require('window');

const window = new Window();
passport.serializeUser(function(user, done) {

    done(null, user);
});


passport.deserializeUser(function(user, done) {

    done(null, user);
});



passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_KEY,
        consumerSecret: process.env.TWITTER_SECRET_KEY,
        callbackURL: process.env.SOCIAL_LOGIN_HOST+"/auth/twitter/callback",
        userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
    },
    function(token, tokenSecret, profile, done ) {

    done(null, profile);




    }
));
