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

    $('#upload-movie-input').change(() => {
        $('#movie-file-url').text($('#upload-movie-input')[0].files[0].name);
    }); 


    $('#upload-subtitle-input').change(() => {
        $('#subtitle-file-url').text($('#upload-subtitle-input')[0].files[0].name);
    }); 

    $('.upload-movie-btn').click(() => {
        $('#upload-movie-input').click();
        $('.progress-bar').text('0%');
        $('.progress-bar').width('0%');
    });

    $('.upload-subtitle-btn').click(() => {
        $('#upload-subtitle-input').click();
        $('.progress-bar').text('0%');
        $('.progress-bar').width('0%');
    });

    $('#submit-movie').click(() => {
        var movieFile = $('#upload-movie-input').get(0).files;
        var subtitleFile = $('#upload-subtitle-input').get(0).files;

        var info = {
            name: $('#movie-title-input').val()
        };

        if (subtitleFile.length > 0) 
            info.subtitle = true;

        if (info.name && info.name !== '' && movieFile.length > 0) {
            $.ajax({
                url: '/upload',
                type: 'POST',
                data: info,
                success: (data) => {
                    var resp = [];

                    function cb(data){
                        if (resp.length === 1 || !info.subtitle){
                            resp.push(data);
                            
                            if (resp.length === 2 && !resp[0].err && !resp[1].err)
                                location.reload();

                            if (resp.length === 1 && !resp[0].err)
                                location.reload();
                        }
                        else {
                            resp.push(data);
                        }   
                    }

                    var movieOptions = {
                        inputId: '#upload-movie-input',
                        name: 'movie',
                        id: data.id,
                        progressbarId: '#movie-progress-bar'
                    };
                    uploadMedia(movieOptions, cb);

                    if (info.subtitle) {
                        var subtitleOptions = {
                            inputId: '#upload-subtitle-input',
                            name: 'subtitle',
                            id: data.id,
                            progressbarId: '#subtitles-progress-bar'
                        };
                        uploadMedia(subtitleOptions, cb);
                    }                    
                }
            });
        }
        else {
            $('#upload-error').text('Missing movie or movie title');
        }
    });

    function uploadMedia(options, cb){
        var formData = new FormData();
        var files = $(options.inputId).get(0).files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            formData.append(options.name, file, file.name);
        }

        $.ajax({
            url: '/upload/media/' + options.id,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: cb,
            xhr: () => {
                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener('progress', (evt) => {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);

                        var progressbar = $(options.progressbarId);
                        progressbar.text(percentComplete + '%');
                        progressbar.width(percentComplete + '%');

                        if (percentComplete === 100) 
                            progressbar.html('Done');
                    }
                }, false);
                return xhr;
            }
        });
    }
});