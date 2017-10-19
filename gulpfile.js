const fileinclude = require('gulp-file-include'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    runSequence = require('run-sequence'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    gulpif = require('gulp-if');

gulp.task('default', ['dev', 'watch']);

gulp.task('watch', function() {
    global.prod = false;
    gulp.watch('src/scripts/**/*.js', ['scripts']);
    gulp.watch('src/styles/**/*.css', ['styles']);
    gulp.watch(['src/views/**/*', 'src/includes/**/*', 'src/public/**/*'], ['files']);
});

gulp.task('prod', function () {
    global.prod = true;
    gulp.start('tasks');
});
gulp.task('dev', function () {
    global.prod = false;
    gulp.start('tasks');
});
gulp.task('tasks', ['scripts', 'styles', 'files']);

gulp.task('scripts', function () {
    return gulp.src(['core.js', 'validate.js', 'appstate.js', 'authentication.js',
        'navbar.js', 'forumpostslist.js', 'forumpost.js', 'newpost.js', 'profile.js', 'signup.js'].map(p => `./src/scripts/${p}`), { base: './src/scripts' })
        .pipe(babel())
        .pipe(concat('main.bundle.min.js'))
        .pipe(gulpif(global.prod, uglify()))
        .pipe(gulp.dest('build/assets/scripts'));
});

gulp.task('styles', function () {
    return gulp.src(['style.css', 'forumpostlist.css', 'forumpost.css', 'profile.css', 'signup.css']
        .map(p => `src/styles/${p}`))
        .pipe(gulpif(global.prod, autoprefixer()))
        .pipe(concat('main.bundle.min.css'))
        .pipe(gulpif(global.prod, cssnano()))
        .pipe(gulp.dest('build/assets/styles'));
})

gulp.task('files', function () {
    gulp.src('src/public/**/**/*').pipe(gulp.dest('build'))
    gulp.src('src/views/**/**/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'src/includes'
        }))
        .pipe(gulp.dest('build'));
});

