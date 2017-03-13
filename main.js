'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');

var setup = require('./routes');

var controllers = {
    movies: require('./controllers/movies.js'),
    users: require('./controllers/users.js'),
    passport: passport
};

var app = express();

app.set('view engine', 'pug');

app.use('/static', express.static('static'));

var strategy = controllers.users.getLocalStrategy();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
passport.serializeUser(controllers.users.serializeUser);
passport.deserializeUser(controllers.users.deserializeUser);  
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

setup(app, controllers);

app.listen(3000, () => {
	console.log('Server is listening on port 3000!');
});