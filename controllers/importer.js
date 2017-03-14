'use strict';

const fs = require('fs');
const srt2vtt = require('srt-to-vtt');
const uuid = require('uuid');
const path = require('path');

const prom = require("bluebird");
prom.promisifyAll(fs);

function doImport (req, res) {
	var location = req.body.location;
	var promises = [];
	var list = [];

	fs.readdirAsync(location)
	.then((files) => {
		for (var i in files)
			promises.push(readFiles(location, files[i], list));
	})
	.catch(err => {
		console.error(err);	
	});

	prom.all(promises).then((something) => {
		console.log(something);
	});

	res.redirect('/');
}

function readFiles(location, folder, list) {
	return new prom((resolve, reject) => {
		if(!location || !folder || !list) {
			reject(new Error('Missing arguments'));
		}
		else {
			var movieFolder = path.join(location, folder);
			resolve({
				path: uuid.v4(),
				name: folder,
				video: path.join(location, folder),
				subtitle: path.join(location, folder)
			});
		}		
	});
}

module.exports = {
	doImport: doImport
};