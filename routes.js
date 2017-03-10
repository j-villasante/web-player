'use strict';

function setup(app, controllers){
	app.get('/', controllers.movies.renderAll);
	app.post('/movie/add', controllers.movies.add);
	app.get('/watch/:movie', controllers.movies.watch);
	app.delete('/movie/remove/:path', controllers.movies.remove);

	app.get('/login', controllers.users.showLogin)
}

module.exports = setup;