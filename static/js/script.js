'use strict';

var $ = require('jquery');
window.$ = window.jQuery = $;
var plyr = require('plyr');
require('rangetouch');
require('bootstrap');
require('sweetalert');

$(() => {
	plyr.setup('video', {
        enabled: !(/webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))
    });

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
            text: 'Are you sure you want to delete the movie?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, remove it!',
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
                        window.location.replace('/');
                });
            });
        });
    });

    $('#get-movies').click(() => {
        $('#get-movies').prop('disabled', true);
        var settings = {
            'url': '/import?location=' + $('#import-location').val(),
            'method': 'GET'
        };

        $.ajax(settings).done((res) => {
            var html;
            if (res.err){
                html = '<span class="text-danger">' + res.err + '</span>';
            }
            else {
                html = 'The following movies have been found: <ul>';
                for (var prop in res) {
                    if(res.hasOwnProperty(prop)){
                        if (!res[prop].movie) {
                            html += '<li>' + prop + ' <span class="text-danger">(Missing .mp4 file.)</span></li>';                        
                        }
                        else if (!res[prop].subtitle) {
                            html += '<li>' + prop + ' <span class="text-danger">(Missing subtitles.)</span></li>';                        
                        }
                        else {
                            html += '<li>' + prop + '</li>';
                        }
                    }
                }
                html += '</ul>';
                $('#import-movies').removeClass('hidden');
            }
            $('#import-body').html(html);
            $('#get-movies').prop('disabled', false);
        });
    });
});