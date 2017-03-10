'use strict';

var $ = require('jquery');
window.$ = window.jQuery = $;
var plyr = require('plyr');
require('rangetouch');
require('bootstrap');

$(() => {
	plyr.setup('video');

    $('.remove-movie').click((event) => {
        var but = $('#' + event.target.id);
        var moviePath = but.data('path');

        var settings = {
            "async": true,
            "url": "/movie/remove/" + moviePath,
            "method": "DELETE"
        }

        $.ajax(settings).done((response) => {
            location.reload();
        });
    });
});