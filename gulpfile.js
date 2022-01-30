"use strict";

const gulp = require("gulp");
const webpack = require("webpack-stream");
const browsersync = require("browser-sync");

const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');

const dist = "./dist/";

gulp.task("build-js", () => {
    return gulp.src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'development',
                    output: {
                        filename: 'script.js'
                    },
                    watch: false,
                    devtool: "source-map",
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    debug: true,
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist + '/js'))
                .on("end", browsersync.reload);
});

gulp.task("watch", () => {
    browsersync.init({
		server: "./dist/",
		port: 4000,
		notify: true
    });
    
    gulp.watch("./src/js/**/*.js", gulp.parallel("build-js")); 
    gulp.watch("src/*.html").on('change', gulp.parallel("html"));
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel("styles"));
});

gulp.task("build-prod-js", () => {
    return gulp.src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'production',
                    output: {
                        filename: 'script.js'
                    },
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist));
});

gulp.task('html', () => {
  return gulp.src("src/*.html")
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest("dist/"))
      .pipe(browsersync.stream());
});

gulp.task('styles', () => {
  return gulp.src("src/sass/**/*.+(scss|sass)")
      .pipe(sass({includePaths: require("node-normalize-scss").includePaths}))
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(rename({suffix: '.min', prefix: ''}))
      .pipe(autoprefixer())
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest("dist/css"))
      .pipe(browsersync.stream());
});

gulp.task("build", gulp.parallel("html", "styles", "build-js"));

gulp.task('fonts', () => {
  return gulp.src("src/fonts/**/*")
      .pipe(gulp.dest("dist/fonts"));
});

gulp.task('icons', () => {
  return gulp.src("src/icons/**/*")
      .pipe(gulp.dest("dist/icons"));
});

gulp.task('mailer', () => {
  return gulp.src("src/mailer/**/*")
      .pipe(gulp.dest("dist/mailer"));
});

gulp.task('images', () => {
  return gulp.src("src/img/**/*")
      .pipe(imagemin())
      .pipe(gulp.dest("dist/img"));
});

gulp.task("default", gulp.parallel("watch", "build"));