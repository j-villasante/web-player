'use strict';

const fs = require('fs');
const path = require('path');

const listurl = path.join(__dirname, '../data/data.json');

function add(req, res){
	var list = require(listurl);
    list.movies.push(req.body);
    var data = JSON.stringify(list, null, '    ');

    fs.writeFileSync(listurl, data);
    res.render('index', list);
}

function remove(req, res){
	var data = require(listurl);
	var moviePath = req.params.path;
	var pos;
	for (var i in data.movies){
		if (data.movies[i].path === moviePath)
			pos = i;
	}

	if (pos){
		data.movies.splice(pos, 1);
		fs.writeFileSync(listurl, JSON.stringify(data, null, '    '));
		res.render('index', data);
	}
	else {
		res.status('404').send('The movie you want to remove does not exists.');
	}
}

function watch(req, res) {
	var list = require(listurl);
    var movies = list.movies;
    var movie = req.params.movie;
    for (var i in movies) {
        if (movies[i].path === movie){
            res.render('video', { mediaRoot: list.mediaRoot, movie: movies[i] });
            return;
        }
    }
    res.status('404').send('The movie does not exists.');
}

function renderAll(req, res) {
	res.render('index', require(listurl));
}

module.exports = {
	add: add,
	renderAll: renderAll,
	watch: watch,
	remove: remove
};