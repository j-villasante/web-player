'use strict';

const settings = require('../data/data.json');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');

var movies = settings.movies;

for (var i in movies) {
	movies[i].path = uuid.v4();
}

fs.writeFileSync(path.join(__dirname, '../data/data.json'), JSON.stringify(settings, null, '    '));