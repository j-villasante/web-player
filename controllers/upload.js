'use strict';

const formidable = require('formidable');
const path = require('path');
const uuid = require('uuid');
const fs = require('fs');

const dataurl = path.join(__dirname, '../data/data.json');

function createMovie(req, res) {
    var id = uuid.v4();
    fs.mkdir(path.join(__dirname, '../static/media/', id), (err) => {
        if (err) res.json({ err: err.message });

        var movie = {
            path: id,
            name: req.body.name,
            video: '/'.concat(id, '/movie.mp4')
        };
        if(req.body.subtitle) movie.subtitle = '/'.concat(id, '/subtitle.vtt');

        var data = require(dataurl);
        data.movies.push(movie);
        fs.writeFileSync(dataurl, JSON.stringify(data, null, '    '));
        res.json({ id: id });
    });
}

function recieveMovie(req, res) {
	var form = new formidable.IncomingForm();
	form.multiples = false;

	var id = req.params.id;
	var newFolder = path.join(__dirname, '../static/media/', id);

	form.uploadDir = newFolder;

	form.on('file', (name, file) => {
		console.log(name);
		console.log(JSON.stringify(file, null, '    '));
		fs.rename(file.path, path.join(form.uploadDir, file.name));
	});

	form.on('error', function(err) {
    	console.log('An error has occured: \n' + err);
  	});

  	form.on('end', function() {
	    res.end('success');
  	});

  	form.parse(req);
}

module.exports = {
    createMovie: createMovie,
	recieveMovie: recieveMovie
};
