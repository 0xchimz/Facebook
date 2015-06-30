var gulp = require('gulp')
var sass = require('gulp-ruby-sass')
var concat = require('gulp-concat')
var minifyCSS = require('gulp-minify-css')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var replace = require('gulp-replace')

var scss_file = 'assets/stylesheets/style.scss'

gulp.task('scss', function () {
  return sass(scss_file, { style: 'nested' })
    .pipe(replace('/*!', '/*'))
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('assets/stylesheets'))
})

gulp.task('js', function () {
  return gulp.src(['assets/js/*.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('assets/javascript'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('assets/javascript'))
})

gulp.task('watch', function () {
  gulp.watch(scss_file, ['scss'])
  gulp.watch('assets/js/*.js', ['js'])
})

gulp.task('default', ['watch'])
