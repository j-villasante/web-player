'use strict';

const formidable = require('formidable');
const path = require('path');
const uuid = require('uuid');
const fs = require('fs');

function recieveMovie(req, res) {
	var form = new formidable.IncomingForm();
	form.multiples = false;

	var id = uuid.v4();
	var newFolder = path.join(__dirname, '../static/media/', id);
	fs.mkdirSync(newFolder);
	
	form.uploadDir = newFolder;

	form.on('file', (name, file) => {
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
	recieveMovie: recieveMovie
};
