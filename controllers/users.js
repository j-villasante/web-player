'use strict';

const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

var database;

function showLogin(req, res) {
	res.render('login', { errors: req.flash('error') });
}

function logged(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

function saveSession(req, res, next) {
    req.session.save((err) => {
        if (err) next(err);
        res.redirect('/');
    });
}

function getLocalStrategy(){
    return new LocalStrategy(login);
}

function serializeUser(admin, done) {
    done(null, admin.correo);
}

function deserializeUser(id, done) {
    getUser(id, function(admin) {
        done(null, admin);
    });
}

function login(username, password, done) {
    getUser(username, function (user){
        if (user){
            console.log(user);
            if (user.pswd == password) {
                return done(null, user);
            }
            else {
                return done(null, false, { message: 'Incorrect password or username.' });
            }
        } else {
            return done(null, false, { message: 'Incorrect password or username.' });
        } 
    });    
}

function getUser(email, callback){
    var usersRef = database.ref('administrador');
    usersRef.on('value', function (snapshot) {
        snapshot.forEach(function (admin){
            if (email === admin.val().correo){
                callback(admin.val());
            }
        });
    });
}

module.exports = function (frbs) {
    database = frbs.database();

    return {
    	showLogin: showLogin,
        getLocalStrategy: getLocalStrategy,
        serializeUser: serializeUser,
        deserializeUser: deserializeUser,
        logged: logged,
        saveSession: saveSession
    }
};