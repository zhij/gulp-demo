const gulp = require('gulp')
// js
const uglify = require('gulp-uglify')  // 压缩js
const babel = require('gulp-babel')
// css
const cleanCSS = require('gulp-clean-css')  // 压缩css
const Less = require('gulp-less')  //  编译less
const autoprefixer = require('gulp-autoprefixer')  // 浏览器前缀
// html
const MinifyHtml = require('gulp-minify-html')  // 压缩html
const FileInclude = require('gulp-file-include') // 文件模块化
const Clean = require('gulp-clean')  // 清理目录

const gUtil = require('gulp-util')
const config = require('./config')
const { dist } = config

// html
async function html() {
  return gulp.src('src/views/*.html')
    .pipe(FileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(MinifyHtml())
    .on('error', function (err) {
      console.error('Task:copy-html', err.message)
      this.end()
    })
    .pipe(gulp.dest(dist))
}

// css
async function css() {
  return await gulp.src('src/css/*.less')
    .pipe(Less())
    .pipe(autoprefixer())
    .pipe(cleanCSS({
      advanced: false,
      compatibility: 'ie8',
      keepBreaks: true,
      keepSpecialComments: '*'
    }))
    .pipe(gulp.dest(dist + '/css'))
}

// js
async function js() {
  return await gulp.src('src/js/*.js')
    .pipe(babel())
    .pipe(uglify()) // 压缩js
    .on('error', function (err) {
      gUtil.log(gUtil.colors.red('[Error]'), err.toString());
    })
    .pipe(gulp.dest(dist + '/js'))
}

// image
async function image() {
  return await gulp.src('src/images/*')
    .pipe(gulp.dest(dist + '/images'));
}


// clean dir
async function clean() {
  // 不设置allowEmpty: true会报File not found with singular glob
  return await gulp.src(dist, { allowEmpty: true }).pipe(Clean());
}



module.exports = {
  html,
  css,
  js,
  image,
  clean
}