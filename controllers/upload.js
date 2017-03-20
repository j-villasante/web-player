'use strict';

const Busboy = require('busboy');
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
	var busboy = new Busboy(
        { 
            headers: req.headers,
            limits: {
                files: 1
            }
        });

    busboy.on('file', function(fieldname, file, filename) {
        var saveTo = path.join(__dirname, '../static/media/', req.params.id);
        var ext = path.extname(filename);
        if (ext === '.mp4'){
            file.pipe(fs.createWriteStream(path.join(saveTo, 'movie.mp4')));
        }
        else if (ext === '.vtt') {
            file.pipe(fs.createWriteStream(path.join(saveTo, 'subtitle.vtt')));
        }
    });

    busboy.on('finish', function() {
        res.json({ mes: 'ok'});
    });

    req.pipe(busboy);
}

module.exports = {
    createMovie: createMovie,
	recieveMediaFile: recieveMediaFile
};
