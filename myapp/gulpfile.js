'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    strip = require('gulp-strip-comments'),
    livereload = require('gulp-livereload'),
    http = require('http'),
    st = require('st'),
    sourcemaps = require('gulp-sourcemaps'),
    ngAnnotate = require('gulp-ng-annotate'),
    babel = require('gulp-babel'),
    uglifycss = require('gulp-uglifycss');

// This method is used to delete the files
gulp.task('clean', function () {
    // You can use multiple globbing patterns as you would with `gulp.src` 
    return del(['./assets/js', './assets/css']);
});

var globalCSS = ['./assets/libs/css/**'];

gulp.task('css', function () {
    gulp.src(globalCSS)
        .pipe(concat('fim-main-libs.css'))
        .pipe(uglifycss({
            "uglyComments": true
        }))
        .pipe(gulp.dest('./assets/css/'))
});

//gulp.task('css', function () {
//    return gulp.src(globalCSS)

//        .pipe(concat('fim-main-libs.css'))
//        .pipe(strip())
//        .pipe(uglify())
//        .pipe(gulp.dest('./assets/css/'))
//});

/* SASS TO CSS CONVERSION*/
gulp.task('sass', function () {
    return gulp.src(['./global/scss/*.scss', './global/scss/lib/*.scss', './modules/**/*.scss'])

        .pipe(sass().on('error', sass.logError))
        .pipe(sass())
        .pipe(concat('fim-main.css'))
        //.pipe(strip())
        .pipe(uglifycss({
            "uglyComments": true
        }))

        .pipe(gulp.dest('./assets/css/'))
});

//This method is converting all JS files to Single file//

var jsFiles = ['./global/util/*.js', './global/util/lib/*.js', './global/util/components/*.js', './modules/**/*service.js', './modules/**/*directive.js', './modules/**/*controller.js'],
    jsDest = './assets/js/',

    jsLibs = [
        'assets/libs/js/tether.min.js',
        'assets/libs/js/jquery.min.js',
        'assets/libs/js/jquery-ui-min.js',
        'assets/libs/js/bootstrap.min.js',
        'assets/libs/js/angular.min.js',
        'assets/libs/js/angular-ui-router.min.js',
        'assets/libs/js/ui-grid-min.js',
        'assets/libs/js/ui-bootstrap-tpls-2.5.0.min.js',
        'assets/libs/js/accordian.js',
        'assets/libs/js/angularResizable.js',
        'assets/libs/js/angular-animate.min.js',
        'assets/libs/js/smart-table.js',
        'assets/libs/js/ngToast.js',
        'assets/libs/js/angular-sanitize.js',
        'assets/libs/js/pubsub.js',
        'assets/libs/js/angular-environment.js',
        'assets/libs/js/deferred-with-update.js',
        'assets/libs/js/multiselect.js',
        'assets/libs/js/angular-chart.min.js',
        'assets/libs/js/common.js'
    ];

gulp.task('libs', function () {
    return gulp.src(jsLibs)
        .pipe(jshint())
        .pipe(strip())
        //.pipe(uglify())
        .pipe(concat('fim-lib-scripts.js'))
        .pipe(gulp.dest(jsDest));
});

gulp.task('scripts', function () {
    return gulp.src(jsFiles)
        .pipe(jshint())
        //.pipe(strip())

        .pipe(sourcemaps.init())
        .pipe(ngAnnotate())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('fim-scripts.js'))
        //.pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(jsDest))
        .pipe(livereload());
        

}
);

gulp.task('js-watch', ['scripts'], function (done) {
    bs.reload();
    done();
});

gulp.task('css-watch', ['sass'], function (done) {
    bs.reload();
    done();
});

// Rerun the task when a file changes
var watch_hintJs = ['./global/util/*.js', './global/util/**/*.js', './modules/**/*service.js', './modules/**/*directive.js', './modules/**/*controller.js'];
var watch_hintscss = ['./global/scss/*.scss', './modules/**/*.scss'];
gulp.task('watch', ['browser-sync'], function () {
    livereload.listen();
    gulp.watch(watch_hintJs, ['jshint', 'js-watch']);
    gulp.watch(watch_hintscss, ['css-watch']);
    
});


/*jshint, watch, browserify*/

// configure the jshint task
gulp.task('jshint', function () {
    return gulp.src(watch_hintJs)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

var bs = require('browser-sync').create();
gulp.task('browser-sync', ['sass'], function () {
    bs.init({
        server: {
            injectChanges: true,
            baseDir: "./"

        },
        browser: ["chrome.exe"]
    });
});
gulp.task('server', function (done) {
    http.createServer(
        st({
            path: __dirname + '/',
            index: 'index.html',
            cache: false
        })
    ).listen(8080, done);
});

gulp.task('default', ['clean', 'css', 'sass', 'libs', 'scripts', 'jshint', 'watch']);
gulp.task('prod', ['clean', 'sass', 'scripts']);
