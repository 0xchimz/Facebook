var gulp = require('gulp')

var sass = require('gulp-ruby-sass')

gulp.task('default', function () {
  return sass('assets/stylesheets/style.scss', { style: 'nested' })
    .pipe(gulp.dest('assets/stylesheets'))
})
