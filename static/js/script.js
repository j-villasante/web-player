'use strict';

var $ = require('jquery');
window.$ = window.jQuery = $;
var plyr = require('plyr');
require('rangetouch');
require('bootstrap');
require('sweetalert');

$(() => {
	plyr.setup('video');

    $('.remove-movie').click((event) => {
        var but = $('#' + event.target.id);
        var moviePath = but.data('path');

        var settings = {
            'async': true,
            'url': '/movie/remove/' + moviePath,
            'method': 'DELETE'
        };

        swal({
            title: 'Confirmation',
            text: 'Are you sure you want to delete the file!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, remove it!",
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
        },
        () => {
            $.ajax(settings)
            .done(() => {
                swal(
                    {
                        title: 'The movie was removed!'
                    }, () => {
                    location.reload();
                });
            });
        });
    });
});