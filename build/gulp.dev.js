const gulp = require('gulp')
const gUtil = require('gulp-util')
const Proxy = require('http-proxy-middleware')

// css
const Less = require('gulp-less')

// html
const FileInclude = require('gulp-file-include') // 文件模块化

// server
const Connect = require('gulp-connect')

const Clean = require('gulp-clean') // 清理目录

// 配置文件
const config = require('./config')
const { dist } = config

async function html() {
  return await gulp.src('src/views/*.html')
    .pipe(FileInclude({  // HTML模板替换
      prefix: '@@',
      basepath: '@file'
    })).on('error', function (err) {
      console.error('Task:copy-html', err.message)
      this.end()
    })
    .pipe(gulp.dest(dist))
    .pipe(Connect.reload())
}

async function css() {
  return await gulp.src('src/css/*.less')
    .pipe(Less())
    .pipe(gulp.dest(dist + '/css'))
    .pipe(Connect.reload())
}

async function js() {
  return await gulp.src('src/js/**')
    .on('error', function (err) {
      gUtil.log(gUtil.colors.red('[Error]'), err.toString())
    })
    .pipe(gulp.dest(dist + '/js'))
    .pipe(Connect.reload())
}

// image
async function image() {
  return await gulp.src('src/images/*')
    .pipe(gulp.dest(dist + '/images'))
}

// clean dir
async function clean() {
  return await gulp.src(dist, { allowEmpty: true })
    .pipe(Clean())
}

// server
async function server() {
  Connect.server({
    root: dist,
    livereload: true,
    middleware: function (connect, opt) {
      return [
        Proxy('/api1', {
          target: '127.0.0.1',
          changeOrigin: true
        }),
        Proxy('/api2', {
          target: '127.0.0.1',
          changeOrigin: true
        })
      ]
    }
  })
}

module.exports = {
  html,
  css,
  js,
  image,
  clean,
  server
}