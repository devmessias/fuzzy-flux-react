var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var less = require('gulp-less');
var cssmin = require('gulp-cssmin');
var gutil = require('gulp-util');
var shell = require('gulp-shell');
var glob = require('glob');
var livereload = require('gulp-livereload');
var jasminePhantomJs = require('gulp-jasmine2-phantomjs');
// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = [
    'react',
    'react/addons'
];
var browserifyTask = function (options) {
    // Our app bundl er
    var appBundler = browserify({
        entries: [options.src], // Only need initial file, browserify finds the rest
        transform: [reactify], // We want to convert JSX to normal javascript
        debug: options.development, // Gives us sourcemapping
        cache: {}, packageCache: {}, fullPaths: options.development // Requirement of watchify
    });
<<<<<<< HEAD
    // We set our dependencies as externals on our app bundler when developing
    (options.development ? dependencies : []).forEach(function (dep) {
        appBundler.external(dep);
=======

    // Run the vendor bundle
    var start = new Date();
    console.log('Building VENDORS bundle');
    vendorsBundler.bundle()
      .on('error', gutil.log)
      .pipe(source('vendorsBase.js'))
      //.pipe(gulpif(!options.development, streamify(uglify())))
      .pipe( streamify(uglify()))
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function () {
        console.log('VENDORS bundle built in ' + (Date.now() - start) + 'ms');
      }));

  }

};
var browserifyTaskFace = function (options) {

  // Our app bundler
  var appBundler = browserify({
    entries: [options.src], // Only need initial file, browserify finds the rest
    transform: [reactify], // We want to convert JSX to normal javascript
    debug: options.development, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: options.development // Requirement of watchify
  });

  // We set our dependencies as externals on our app bundler when developing
  (options.development ? dependencies : []).forEach(function (dep) {
    appBundler.external(dep);
  });

  // The rebundle process
  var rebundle = function () {
    var start = Date.now();
    console.log('Building APP bundle');
    appBundler.bundle()
      .on('error', gutil.log)
      .pipe(source('face.js'))
      .pipe(gulpif(!options.development, streamify(uglify())))
      .pipe(gulp.dest(options.dest))
      .pipe(gulpif(options.development, livereload()))
      .pipe(notify(function () {
        console.log('APP bundle built in ' + (Date.now() - start) + 'ms');
      }));
  };

  // Fire up Watchify when developing
  if (options.development) {
    appBundler = watchify(appBundler);
    appBundler.on('update', rebundle);
  }

  rebundle();

  // We create a separate bundle for our dependencies as they
  // should not rebundle on file changes. This only happens when
  // we develop. When deploying the dependencies will be included
  // in the application bundle
  if (options.development) {



    // Remove react-addons when deploying, as it is only for
    // testing
    if (!options.development) {
      dependencies.splice(dependencies.indexOf('react-addons'), 1);
    }

    var vendorsBundler = browserify({
      debug: true,
      require: dependencies
>>>>>>> 3cefb5a11fa89d595acede5a72420212bf54c3c1
    });
    // The rebundle process
    var rebundle = function () {
        var start = Date.now();
        console.log('Building APP bundle');
        appBundler.bundle()
        .on('error', gutil.log)
        .pipe(source('react.js'))
        .pipe(gulpif(!options.development, streamify(uglify())))
        .pipe(gulp.dest(options.dest))
        .pipe(gulpif(options.development, livereload()))
        .pipe(notify(function () {
            console.log('APP bundle built in ' + (Date.now() - start) + 'ms');
        }));
    };
    // Fire up Watchify when developing
    if (options.development) {
        appBundler = watchify(appBundler);
        appBundler.on('update', rebundle);
    }
    rebundle();
    // We create a separate bundle for our dependencies as they
    // should not rebundle on file changes. This only happens when
    // we develop. When deploying the dependencies will be included
    // in the application bundle
    if (options.development) {
        // Remove react-addons when deploying, as it is only for
        // testing
        if (!options.development) {
            dependencies.splice(dependencies.indexOf('react-addons'), 1);
        }
        var vendorsBundler = browserify({
            debug: true,
            require: dependencies
        });
        // Run the vendor bundle
        var start = new Date();
        console.log('Building VENDORS bundle');
        vendorsBundler.bundle()
        .on('error', gutil.log)
        .pipe(source('vendors.js'))
        //.pipe(gulpif(!options.development, streamify(uglify())))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest(options.dest))
        .pipe(notify(function () {
            console.log('VENDORS bundle built in ' + (Date.now() - start) + 'ms');
        }));
    }
<<<<<<< HEAD
=======

    var vendorsBundler = browserify({
      debug: true,
      require: dependencies
    });

    // Run the vendor bundle
    var start = new Date();
    console.log('Building VENDORS bundle');
    vendorsBundler.bundle()
      .on('error', gutil.log)
      .pipe(source('vendors.js'))
      //.pipe(gulpif(!options.development, streamify(uglify())))
      .pipe(streamify(uglify()))
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function () {
        console.log('VENDORS bundle built in ' + (Date.now() - start) + 'ms');
      }));

  }

>>>>>>> 3cefb5a11fa89d595acede5a72420212bf54c3c1
};
gulp.task('feiurar', function() {
    gulp.src(['static/js/react.js','static/js/vendors.js'])
    .pipe(uglify())
    .pipe(gulp.dest('static/js'))
});
var cssTask = function (options) {
    if (options.development) {
        var run = function () {
            console.log(arguments);
            var start = new Date();
            console.log('Building CSS bundle');
            gulp.src(options.src)
            .pipe(concat('react.css'))
            .pipe(gulp.dest(options.dest))
            .pipe(notify(function () {
                console.log('CSS bundle built in ' + (Date.now() - start) + 'ms');
            }));
        };
        run();
        gulp.watch(options.src, run);
    } else {
        gulp.src(options.src)
        .pipe(concat('react.css'))
        .pipe(cssmin())
        .pipe(gulp.dest(options.dest));
    }
};
gulp.task('less', function() {
    cssTask({
        development: true,
        src: './assets/less/*.less',
        dest: './dist/css'
    });
});
gulp.task('default', function () {
    browserifyTask({
        development: true,
        src: './appReact/app.js',
        dest: './dist/js'
    });
    cssTask({
        development: true,
        src: './assets/less/*.less',
        dest: './dist/css'
    });
});
gulp.task('deploy', function () {
    browserifyTask({
        development: false,
        src: './appReact/app.js',
        dest: './dist/js'
    });
    cssTask({
        development: false,
        src: './assets/less/*.less',
        dest: './dist/css'
    });
});
gulp.task('mobile, feiurar', function () {
    browserifyTask({
        development: false,
        src: './appReact/app.js',
        dest: './dist/js'
    });
    cssTask({
        development: false,
        src: './assets/less/*.less',
        dest: './dist/css'
    });
});
