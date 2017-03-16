'use strict';

const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const rimraf = require('rimraf');

const listurl = path.join(__dirname, '../data/data.json');

function add(req, res){
	var list = require(listurl);
	var newMovie = req.body;
	newMovie.path = uuid.v4();

    list.movies.push(newMovie);
    var data = JSON.stringify(list);

    fs.writeFileSync(listurl, data);
    res.redirect('/');
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
		fs.writeFileSync(listurl, JSON.stringify(data));
		res.render('index', data);
	}
	else {
		res.status('404').send('The movie you want to remove does not exists.');
	}
}

function removeMovieFiles(req, res, next) {
	if (req.body.files) {
		rimraf(path.join(__dirname, '../static/media/') + req.params.path, (err) => {
			if (err){
				res.json({ err: err.message });
			}
			else{
				next();				
			} 
		});
	}
	else {
		next();
	}
}

function watch(req, res) {
	var list = require(listurl);
    var movies = list.movies;
    var movie = req.params.movie;

    for (var i in movies) {
        if (movies[i].path.toUpperCase() === movie.toUpperCase()){
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
	remove: remove,
	removeMovieFiles: removeMovieFiles
};