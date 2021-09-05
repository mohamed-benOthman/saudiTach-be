const passport = require('passport');
const session = require('express-session');
const  LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
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

passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_KEY,
    clientSecret: process.env.LINKEDIN_SECRET,
    callbackURL: process.env.SOCIAL_LOGIN_HOST+"/auth/linkedin/callback",
    scope: ['r_liteprofile', 'r_emailaddress'],
}, function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {


        return done(null, profile);
    });
}));
