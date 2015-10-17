var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    stylus      = require('gulp-stylus'),
    jade        = require('gulp-jade'),
    concat      = require('gulp-concat'),
    browserSync = require('browser-sync').create();
    livereload  = require('gulp-livereload');
    tinylr      = require('tiny-lr'),
    express     = require('express'),
    app         = express(),
    path        = require('path'),
    server      = tinylr();


// Get one .styl file and render 
gulp.task('styles', function () {
  gulp.src('./stylus/**/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./dist/css'))
    .pipe(livereload())
    gutil.log('Crushing some stylus');
});

gulp.task('js', function() {
  return gulp.src('scripts/*.js')
    .pipe( concat('all.min.js'))
    .pipe( gulp.dest('dist/js/'))
    .pipe(livereload())
    gutil.log('Concat complete');
});

gulp.task('templates', function() {
  return gulp.src('views/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(livereload())
    gutil.log('What\'s up with the name Jade anyways?');
});

gulp.task('express', function() {
  app.set('view engine','jade')
  app.use(express.static(path.resolve('./dist')));
  app.locals.basedir = path.join(__dirname, 'dist');
  app.use(require('connect-livereload')({port: 35729}));
  app.listen(4000, '0.0.0.0');
  gutil.log('Totally looking for 8008\'s right now');
});

gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(35729);
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('watch', function () {
  gulp.watch('stylus/**/*.styl',['styles']);
  gulp.watch('scripts/*.js',['js']);
  gulp.watch('views/*.jade',['templates']);
  gulp.watch('dist/*.html', notifyLiveReload);
  gulp.watch('dist/css/*.css', notifyLiveReload);
  gutil.log('Don\'t mind me, i\'ll just sit here and watch');
});

gulp.task('default', ['styles','js','templates','express','livereload', 'watch'], browserSync.reload);








