'use strict';

const crypto = require('crypto');
const uuid = require('uuid');
const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');

function showUpload(req, res) {
	res.render('files');
}

function encryptFile(req, res) {
	const uniqueFilename = uuid.v4();
	const buf = crypto.randomBytes(64);
	const password = buf.toString('hex');
	const cipher = crypto.createCipher('aes192', password);
	var ext;

	const busboy = new Busboy({ headers: req.headers });
	console.log('encrypting...');

	busboy.on('file', function(fieldname, file, filename) {
		const saveTo = path.join(__dirname, '../files/', uniqueFilename);
		ext = path.extname(filename);
		const output = fs.createWriteStream(saveTo);
		file.pipe(cipher).pipe(output);
    });

    busboy.on('finish', function() {
		res.json({
			url: '/file/download/'.concat(uniqueFilename, '/', password, '/', ext)
		});
    });

    req.pipe(busboy);
}

function decryptFile(req, res) {
	const decipher = crypto.createDecipher('aes192', req.params.password);
	const input = fs.createReadStream(path.join(__dirname, '../files/', req.params.filename));

	res.setHeader('Content-disposition', 'attachment; filename=file' + req.params.extension);

	input.pipe(decipher).pipe(res);
}

module.exports = {
	showUpload: showUpload,
	encryptFile: encryptFile,
	decryptFile: decryptFile
};
