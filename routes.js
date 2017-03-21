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
    app.delete('/movie/remove/:path', controllers.movies.removeMovieFiles, controllers.movies.remove);

    app.post('/import', controllers.importer.doImport);
    app.get('/import', controllers.importer.showFoundFiles);

    app.post('/upload', controllers.upload.createMovie);
    app.post('/upload/media/:id', controllers.upload.recieveMediaFile);

    app.get('/file', controllers.file.showUpload);
    app.post('/file/upload', controllers.file.encryptFile);
    app.get('/file/download/:filename/:password/:extension', controllers.file.decryptFile);

    app.get('*', (req, res) => {
        res.sendFile('views/404page.html', { root: __dirname });
    });
}

module.exports = setup;