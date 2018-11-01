const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const inject = require('gulp-inject');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

// Move JS Files to app/js
gulp.task('css', function () {
    return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest("app/assets/css"))
        .pipe(browserSync.stream());
});

// Move JS Files to app/js
gulp.task('js', function () {
    return gulp.src([
            'node_modules/bootstrap/dist/js/bootstrap.min.js',
            'node_modules/jquery/dist/jquery.min.js',
        ])
        .pipe(gulp.dest("app/assets/js"))
        .pipe(browserSync.stream());
});


// Inject Html Files
gulp.task('inject', function () {
    return gulp.src('html/*.html')
        .pipe(inject(gulp.src([
            'html/partials/cssfiles.html',
            'html/partials/jsfiles.html',
            'html/partials/header.html',
            'html/partials/footer.html'
        ]), {
            starttag: '<!-- inject:{{path}} -->',
            relative: true,
            transform: function (filePath, file) {
                return file.contents.toString('utf8');
            }
        }))
        .pipe(gulp.dest('app/'));
});



// Compile Sass & Inject Into Browser
gulp.task('style', function () {
    return gulp.src('app/assets/scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            ourputStyle: 'expanded'
        }))
        .on('error', console.error.bind(console))
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("app/assets/css"))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Watch Sass & Serve
gulp.task('watcher', function () {
    browserSync.init({
        server: './app'
    });
    gulp.watch('app/assets/scss/**', ['style']);
    gulp.watch('html/partials/*', ['inject']);
    gulp.watch('html/*', ['inject']);
    gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('ready', ['css', 'js']);

gulp.task('default', ['inject', 'style', 'watcher']);