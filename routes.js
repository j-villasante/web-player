'use strict';

function setup(app, controllers){
    var passport = controllers.passport;  

    app.get('/login', controllers.users.showLogin);

    app.post('/login', 
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), 
        controllers.users.saveSession);
    
    app.get('/logout',  (req, res, next) => {
        req.logout();
        next();
    },
    controllers.users.saveSession);

    //app.use(controllers.users.logged);

    app.get('/', controllers.movies.renderAll);
    app.get('/watch/:movie', controllers.movies.watch);
    app.post('/movie/add', controllers.movies.add);
    app.delete('/movie/remove/:path', controllers.movies.remove);

    app.post('/import', controllers.importer.doImport);
    app.get('/import', controllers.importer.showFoundFiles);
}

module.exports = setup;