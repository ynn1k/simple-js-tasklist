const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const terser = require('gulp-terser'); //uglify ES6+
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

// html minify
gulp.task("html", function () {
    return gulp.src("./src/*.html")
        .pipe(htmlmin({
            caseSensitive: true,
            collapseWhitespace: true,
            collapseInlineTagWhitespace: true,
            decodeEntities: false,
            removeComments: true,
            useShortDoctype: true
        }))
        .pipe(gulp.dest("./dist"))
        .pipe(browserSync.stream());
});

// sass compile & prefix & sourcemaps
gulp.task("sass", function () {
    return gulp.src(["./src/css/*.scss"])
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({ basename: "style", suffix: '.min' }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist"));
});

// js minify & merge
gulp.task('scripts', function () {
    return gulp.src('./src/js/*.js')
        .pipe(concat("script.js"))
        .pipe(terser())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist/'));
});

// copy images
gulp.task("img", function () {
    return gulp.src("./src/img/*.*")
        .pipe(gulp.dest("./dist/img"))
        .pipe(browserSync.stream());
});

// watch & serve
gulp.task("serve", gulp.series(["sass", "scripts", "html", "img"], function () {
    browserSync.init({
        server: "./dist"
    });

    gulp.watch(["./src/css/*.scss", "./src/js/*.js", "./src/*.html", "./src/img/*.*"], gulp.series(["sass", "scripts", "html", "img"]));
}));

// default task
gulp.task("default", gulp.series(["serve"]));
