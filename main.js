'use strict';

var express = require('express');
var auth = require('http-auth');
var bodyParser = require('body-parser');

var setup = require('./routes');

var controllers = {
    movies: require('./controllers/movies.js')
};

var app = express();

var basic = auth.basic({
    realm: "Users",
    file: __dirname + "/data/users.htpasswd"
});

app.set('view engine', 'pug');
app.use(auth.connect(basic));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static('static'));

setup(app, controllers);

app.get('/logout', function (req, res) {
	res.status(401).render('logout', {});
});

app.listen(3000, function () {
	console.log('Server is listening on port 3000!');
});


