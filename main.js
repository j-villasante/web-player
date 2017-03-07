'use strict';

var express = require('express');
var app = express();

app.set('view engine', 'pug');
app.use('/static', express.static('static'));

app.get('/hello', function (req, res) {
	res.send('hello');
});

app.get('/', function (req, res) {
	res.render('index', { title: 'Hey', message: 'Hello there!' });
});

app.listen(3000, function () {
	console.log('Server is listening on port 3000!');
});
