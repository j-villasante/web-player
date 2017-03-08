'use strict';

var express = require('express');
var app = express();
var auth = require('http-auth');
var config = require('./list.json');

var basic = auth.basic({
    realm: "Users",
    file: __dirname + "/data/users.htpasswd"
});

app.set('view engine', 'pug');
app.use(auth.connect(basic));
app.use('/static', express.static('static'));

app.get('/logout', function (req, res) {
	res.status(401).render('logout', {});
});

app.get('/watch/:movie', function(req, res) {
    var movie = req.params.movie;
    for (var i in config.movies) {
        if (config.movies[i].path === movie){
            res.render('video', { mediaRoot: config.mediaRoot, movie: config.movies[i] });
            return;
        }
    }
    res.status('404').send('La pelicula no existe.');
});

app.get('/', function (req, res) {
	res.render('index', config);
});

app.listen(3000, function () {
	console.log('Server is listening on port 3000!');
});


