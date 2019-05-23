(() => {
    'use strict';

    const gulp = require('gulp');
    const babel = require('gulp-babel');
    const sourcemaps = require('gulp-sourcemaps');
    const webserver = require('gulp-webserver');
    const sass = require('gulp-sass');
    var autoprefixer = require('gulp-autoprefixer');

    gulp.task('js:build', () => {
        return gulp.src('js/timeline-chart.js')
            .pipe(sourcemaps.init())
            .pipe(babel())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist'));
    });

    gulp.task('js:watch', () => {
        return gulp.watch('js/*', ['js:build']);
    });

    gulp.task('css:build', function () {
      return gulp.src('./scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./dist'));
    });

    gulp.task('css:watch', () => {
        return gulp.watch('scss/*', ['css:build']);
    });

    gulp.task('serve', () => {
        gulp.src('./')
            .pipe(webserver({
                livereload: true,
                directoryListing: true,
                open: true
            }));
    });


    gulp.task('default', ['js:watch', 'css:watch', 'serve']);
})();
