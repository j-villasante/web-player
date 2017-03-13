'use strict';

const gulp = require('gulp');
const browserify = require('browserify');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();

gulp.task('minify-js', ['browserify'], () => {
	return gulp.src(['./static/bundle.js', './static/js/*'])
		.pipe(babel({
		    presets: ['es2015'],
		    compact: true
        }))
		.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(uglify())
			.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('./static/dist/js'));
});

gulp.task('browserify', (cb) => {
	const b = browserify({
		entries: './static/js/script.js',
		debug: true
	});

	return b.bundle()
		.pipe(source('bundle.js'))
	    .pipe(buffer())
	    .pipe(sourcemaps.init({
	    	loadMaps: true
	    }))
    	.pipe(sourcemaps.write('./maps'))
	    .pipe(gulp.dest('./static'));
});

gulp.task('default', ['nodemon', 'browser-sync', 'watchers']);

gulp.task('watchers', () => {
	gulp.watch('./static/js/*', ['browserify'], () => {
		browserSync.reload();
	});
});

gulp.task('nodemon', () => {
	var demon = nodemon({ 
		script: 'main.js',
		ignore: ['data/*', 'static/js/*'],
		ext: 'pug js css'
	});

	demon
	.on('start', () => {
		browserSync.reload();
	})
	.on('crash', function() {
		console.error('Application has crashed!\n');
		demon.emit('restart', 10);
	});
});

gulp.task('browser-sync', () => {
	browserSync.init({
		proxy: 'localhost:3000',
		port: 3001,
		reloadDelay: 500,
		ui: {
			port: 3002
		},
		open: false
	});
});

gulp.task('build', ['browserify', 'minify-js']);