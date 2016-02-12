'use strict';

var gulp        = require('gulp'),
    prefixer    = require('gulp-autoprefixer'),
    uglify      = require('gulp-uglify'),
    stylus      = require('gulp-stylus'),
    jade        = require('gulp-jade'),
    sourcemaps  = require('gulp-sourcemaps'),
    concat      = require("gulp-concat"),
    cssnano     = require('gulp-cssnano'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    rimraf      = require('rimraf'),
    browserSync = require("browser-sync"),
    webpack     = require('webpack-stream'),
    reload      = browserSync.reload;

var path = {
    build: {
        html:  'build/',
        js:    'build/js/',
        css:   'build/css/',
        img:   'build/img/',
        fonts: 'build/fonts/',
        json:  'build/data/'
    },
    src: {
        html:  'src/html/*.jade',
        js:    'src/js/main.js',
        css:   'src/css/style.styl',
        img:   'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        json:  'src/data/**/*.json'
    },
    watch: {
        html:  'src/html/**/*.jade',
        js:    'src/js/**/*.js',
        css:   'src/css/**/*.styl',
        img:   'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        json:  'src/data/**/*.json'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend"
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('jade:build', function () {
    gulp.src(path.src.html)
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.watch.js)
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('stylus:build', function () {
    gulp.src(path.src.css) 
        .pipe(sourcemaps.init())
        .pipe(stylus({
            'include css': true
        }))
        .pipe(prefixer())
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) 
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('json:build', function() {
    gulp.src(path.src.json)
        .pipe(gulp.dest(path.build.json))
});

gulp.task('build', [
    'jade:build',
    'js:build',
    'stylus:build',
    'fonts:build',
    'json:build'
]);


gulp.task('watch', function(){
    gulp.watch(path.watch.html,   ['jade:build']);

    gulp.watch(path.watch.css,    ['stylus:build']);

    gulp.watch(path.watch.js,     ['js:build']);

    gulp.watch(path.watch.img,    ['image:build']);

    gulp.watch(path.watch.fonts,  ['fonts:build']);

    gulp.watch(path.watch.json,   ['json:build']);
});

gulp.task('default', ['build', 'webserver', 'watch']);