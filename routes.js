'use strict';

function setup(app, controllers){
    var passport = controllers.passport;  

    app.get('/login', controllers.users.showLogin);

    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) return next(err);
            if (!user) { return res.redirect('/login'); }
            req.login(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/');
            });
        })(req, res, next);
    });
    
    app.get('/logout', controllers.users.logout);

    app.get('/', controllers.users.logged, controllers.movies.renderAll);
    app.get('/watch/:movie', controllers.users.logged, controllers.movies.watch);
    app.post('/movie/add', controllers.users.logged, controllers.movies.add);
    app.delete('/movie/remove/:path', controllers.users.logged, controllers.movies.remove);
}

module.exports = setup;