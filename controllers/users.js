'use strict';

function showLogin(req, res) {
	res.render('login', {});
}

module.exports = {
	showLogin: showLogin
}