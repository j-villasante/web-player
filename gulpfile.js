'use strict';

const browserify = require('browserify');
const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');

gulp.task('minify-js', () => {
	return gulp.src('./static/bundle.js')
		.pipe(babel({
		    presets: ['es2015']
        }))
		.pipe(sourcemaps.init())
			.pipe(uglify())
			.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./static/dist/js'));
});

gulp.task('browserify', () => {
	const b = browserify({
		entries: './static/bundle.js'
	});

	return b.bundle()
		.pipe(source('bundle.js'))
	    .pipe(buffer())
	    .pipe(gulp.dest('./static/dist/js'));
});

gulp.task('build', ['browserify', 'minify-js']);