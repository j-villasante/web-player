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
        fs.writeFileSync(dataurl, JSON.stringify(data));
        res.json({ id: id });
    });
}

function recieveMediaFile(req, res) {
	var form = new formidable.IncomingForm();
	form.multiples = false;

	var id = req.params.id;

	form.uploadDir = path.join(__dirname, '../static/media/', id);

	form.on('file', (name, file) => {
        var ext = path.extname(file.name);
        if (ext === '.mp4'){
            fs.rename(file.path, path.join(form.uploadDir, 'movie.mp4'));
        }
        else if (ext === '.vtt') {
            fs.rename(file.path, path.join(form.uploadDir, 'subtitle.vtt'));
        }
	});

	form.on('error', function(err) {
    	res.json({ err: err.message });
  	});

  	form.on('end', function() {
	    res.json({ mes: 'ok'});
  	});

  	form.parse(req);
}

module.exports = {
    createMovie: createMovie,
	recieveMediaFile: recieveMediaFile
};
