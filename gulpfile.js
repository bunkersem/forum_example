var fileinclude = require('gulp-file-include'),
  gulp = require('gulp'),
  gutil = require('gulp-util');

 
gulp.task('fileinclude', function() {
  gulp.src('views/**/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: 'includes'
    }))
    .pipe(gulp.dest('public'));
});

gulp.task('run', ['fileinclude']);
gulp.task('watch', function() {
  gulp.watch('views/**/*.html', ['fileinclude']);
  gulp.watch('includes/**/*', ['fileinclude']);
})

gulp.task('default', ['run', 'watch']);