'use strict';

const fs = require('fs');
const srt2vtt = require('srt2vtt');
const uuid = require('uuid');
const path = require('path');
const Promise = require("bluebird");

const rename = Promise.promisify(fs.rename);
const writeFile = Promise.promisify(fs.writeFile);

const dataurl = path.join(__dirname, '../data/data.json');

function doImport (req, res) {
	var location = req.body.location;

	var structure = {};
	getAllFiles(location, structure);

	console.log(JSON.stringify(structure, null, '    '));

	var result = moveFiles(structure);

	Promise.all(result.list)
	.then(() => {
		var data = require(dataurl);
		data.movies = data.movies.concat(result.movies);
		return writeFile(dataurl, JSON.stringify(data));
	})
	.then(() => {
		res.redirect('/');
	})
	.catch(err => {
		console.log(err);
	});
}

function getAllFiles(location, structure) {
	if (fs.lstatSync(location).isDirectory()){
		var result = fs.readdirSync(location);

		for (var i in result) {
			var fullpath = path.join(location, result[i]);
			var ext = path.extname(fullpath);			
			if(ext === '.mp4' || ext === '.vtt' || ext === '.srt'){
				var aux = path.dirname(fullpath).split('/');
				var folderName = aux[aux.length - 1];
				if (!structure[folderName]){
					structure[folderName] = {};
					structure[folderName].id = uuid.v4();
				}

				if (ext === '.mp4')	
					structure[folderName].movie = fullpath;

				if (ext === '.vtt')
					structure[folderName].subtitle = fullpath;

				if (!structure[folderName].subtitle && ext === '.srt')
					structure[folderName].subtitle = fullpath;
			}else {
				getAllFiles(fullpath, structure);				
			}
		}
	}
}

function moveFiles(structure){
	var list = [];
	var movies = [];
	for (var prop in structure) {
		if (structure.hasOwnProperty(prop) && structure[prop].movie){
			var obj = structure[prop];

			var movie = {
				path: obj.id,
				name: prop,
				video: '/'.concat(obj.id, '/movie.mp4')
			};

			fs.mkdirSync('./static/media/'.concat(obj.id));

			var ext = path.extname(obj.movie);
			if (ext === '.mp4')
				list.push(rename(obj.movie, './static/media/'.concat(obj.id, '/movie.mp4')));

			if (obj.subtitle){
				movie.subtitle = '/'.concat(obj.id, '/subtitle.vtt');
				ext = path.extname(obj.subtitle);
				if (ext === '.vtt'){
					list.push(rename(obj.subtitle, './static/media/'.concat(obj.id, '/subtitle.vtt')));
				}else if (ext === '.srt'){
					list.push(new Promise((resolve, reject) => {
						var data = fs.readFileSync(obj.subtitle);
						srt2vtt(data, (err, vttData) => {
							if (err) reject(err);
							fs.writeFileSync('./static/media/'.concat(obj.id, '/subtitle.vtt'), vttData);
							resolve('converted to vtt');
						});
					}));
				}
			}
			movies.push(movie);
		}
	}

	return {
		list: list,
		movies: movies
	};
}

module.exports = {
	doImport: doImport
};