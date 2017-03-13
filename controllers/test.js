'use strict';

var settings = require('../data/data.json');
var uuid = require('uuid');
var fs = require('fs');
const path = require('path');

var movies = settings.movies;

for (var i in movies) {
	movies[i].path = uuid.v4();
}

fs.writeFileSync(path.join(__dirname, '../data/data.json'), JSON.stringify(settings, null, '    '));