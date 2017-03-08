'use strict';

var $ = require('jquery');
window.$ = window.jQuery = $;
var plyr = require('plyr');
require('rangetouch');
//require('bootstrap');

$(() => {
	plyr.setup('video');
});