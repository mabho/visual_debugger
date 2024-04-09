const gulp = require('gulp');
const terser = require('gulp-terser');

gulp.task('minify', function () {
  return gulp.src('js/source/**/*.js')
    .pipe(terser())
    .pipe(gulp.dest('js/dist'));
});

gulp.task('watch', function () {
  gulp.watch('js/source/**/*.js', gulp.series('minify'));
});
