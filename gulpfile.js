var gulp = require('gulp')
var sass = require('gulp-ruby-sass')
var concat = require('gulp-concat')
var minifyCSS = require('gulp-minify-css')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var replace = require('gulp-replace')
var shell = require('gulp-shell')

var scss_file = 'assets/stylesheets/style.scss'

gulp.task('docs', shell.task([
  'node node_modules/jsdoc/jsdoc.js ' +
  '-c node_modules/angular-jsdoc/common/conf.json ' +
  '-t node_modules/angular-jsdoc/default ' +
  '-d docs ' +
  './README.md ./.json ' +
  '-r assets'
]))

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

gulp.task('watch-withoutjs', function () {
  gulp.watch(scss_file, ['scss'])
})

gulp.task('default', ['watch-withoutjs', 'docs'])
