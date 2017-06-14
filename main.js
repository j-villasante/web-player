'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const compression = require('compression');

var firebase = require('firebase');

var setup = require('./routes');

firebase.initializeApp({
  serviceAccount: "veryimportantpet-9c2a35b29cd3.json",
  databaseURL: "https://veryimportantpet-d7ccc.firebaseio.com/"
});

// var usersRef = firebase.database().ref('administrador');
// console.log('asds');
// usersRef.on('value', function (snapshot) {
//     snapshot.forEach(function (administrador){
//         console.log(administrador.val());
//     });
// }, function (errorObject) {
//   console.log("The read failed: " + errorObject.code);
// });

var controllers = {
    movies: require('./controllers/movies.js'),
    users: require('./controllers/users.js')(firebase),
    importer: require('./controllers/importer.js'),
    upload: require('./controllers/upload.js'),
    file: require('./controllers/file.js'),
    passport: passport
};

var app = express();

app.use(compression());
app.set('view engine', 'pug');

app.use('/static', express.static('static'));

var strategy = controllers.users.getLocalStrategy();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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