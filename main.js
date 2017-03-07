'use strict';

var express = require('express');
var app = express();
var auth = require('http-auth');

var basic = auth.basic({
    realm: "Users",
    file: __dirname + "/data/users.htpasswd"
});

app.set('view engine', 'pug');
app.use(auth.connect(basic));
app.use('/static', express.static('static'));

app.get('/hello', function (req, res) {
	res.send('hello');
});

app.get('/logout', function (req, res) {
	res.status(401).send('Logout');
});

app.get('/', function (req, res) {
	res.render('index', { title: 'Hey', message: 'Hello there!' });
});

app.listen(3000, function () {
	console.log('Server is listening on port 3000!');
});


