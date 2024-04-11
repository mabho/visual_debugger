const gulp = require('gulp');
const terser = require('gulp-terser');
const rename = require('gulp-rename');

gulp.task('minify', function () {
  return gulp.src('js/source/**/*.js')
    .pipe(terser())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('js/dist'));
});

gulp.task('watch', function () {
  gulp.watch('js/source/**/*.js', gulp.series('minify'));
});
