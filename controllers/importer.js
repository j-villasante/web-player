'use strict';

const fs = require('fs');
const srt2vtt = require('srt-to-vtt');
const uuid = require('uuid');
const path = require('path');

function doImport (req, res) {
	var location = req.body.location;

	var structure = [];
	getAllFiles(location, structure);

	//console.log(JSON.stringify(tree, null, '    '));

	res.redirect('/');
}

function getAllFiles(location, structure) {
	if (fs.lstatSync(location).isDirectory()){
		var result = fs.readdirSync(location);

		for (var i in result) {
			var fullpath = path.join(location, result[i]);
			var ext = path.extname(fullpath);			
			if(ext === '.mp4' || ext === '.vtt'){
				
			}else {
				getAllFiles(fullpath);				
			}
		}
	}
}

function moveMediaFiles(structure){
	var rt = tree.name;

}

module.exports = {
	doImport: doImport
};