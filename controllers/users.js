'use strict';

var bcrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;

function showLogin(req, res) {
	res.render('login');
}

function logged(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

function logout(req, res) {
    req.logout();
    res.redirect('/');
}

function getLocalStrategy(){
    return new LocalStrategy(login);
}

function serializeUser(user, done) {
    done(null, user.id);
}

function deserializeUser(id, done) {
    var user = getUser(id, 'id');
    done(null, user);
}

function login(username, password, done) {
    var user = getUser(username, 'username');
    if (user){
        bcrypt.compare(password, user.password, function(err, res) {
            if (err) return done(err);

            if (res){
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    } else {
        return done(null, false);
    }
    
}

function getUser(key, name){
    var users = require('../data/users.json').users;
    for (var i in users) {
        var user = users[i];
        if (key === user[name])
            return user;
    }
}

module.exports = {
	showLogin: showLogin,
    getLocalStrategy: getLocalStrategy,
    serializeUser: serializeUser,
    deserializeUser: deserializeUser,
    logged: logged,
    logout: logout
}