var gulp = require('gulp'),
	connect = require('gulp-connect'),           //web测试服务器
	rename = require('gulp-rename'),             //重命名
	notify = require('gulp-notify'),             //重命名
	livereload = require('gulp-livereload'),     //自动刷新
	concat = require('gulp-concat'),             //文件合并
    del = require("del"),                        //清空数据
	minimg = require('gulp-imagemin'),		     //图片压缩
	sass = require('gulp-sass'),				 //sass编译
    minifyCss = require('gulp-minify-css'),      //css压缩
    autoprefixer = require('gulp-autoprefixer'), //自动补全css前缀
	jshint = require('gulp-jshint'),             //js格式检查
	uglify = require('gulp-uglify');             //js压缩

//CSS
gulp.task('sass', function() {
	return gulp.src('public/style/scss/*.scss')
		.pipe(sass({errLogToConsole: true}))
		.pipe(autoprefixer({browsers:['last 2 versions', 'safari 5', 'opera 12.1', 'ios 6', 'android 4']}))
		.pipe(gulp.dest('public/style/css'));
		// .pipe(notify({message: 'sass is compiled'}));
});
gulp.task('mincss', ['sass'], function() {
	return gulp.src('public/style/css/*.css')
    	.pipe(rename({suffix:'.min'}))
		.pipe(minifyCss())
    	.pipe(gulp.dest('build'))
    	.pipe(notify({message: 'mincss'}));
});
//JS
gulp.task('minjs', function() {
	return gulp.src('public/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(concat('all.js'))
		.pipe(gulp.dest('public/js'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(uglify())
		.pipe(gulp.dest('build'))
		.pipe(notify({
			message: 'minjs'
		}));
});
/* 压缩图片 */
// gulp.task('images', function(){
//     return gulp.src(path.img + "**/*")
//         .pipe(minimg({optimizationLevel: 3, progressive: true, interlaced: true}))
//         .pipe(gulp.dest(path.build + '/images'))
//         .pipe(notify({message : 'Images task complete'}))
// })
// 清空数据
gulp.task('clean', function() {
	del(['build']);
});
//启动web测试服务器
gulp.task('serve', function() {
	connect.server({
		root: '',
		port: 8000,
		livereload: true
	});
});
//reload
gulp.task('html', function () {
 	gulp.src(['webapp/views/*.html'])
		.pipe(connect.reload());
});
// watch
gulp.task('watch', function() {
	return gulp.watch([
		'public/style/scss/*.scss',
		'webapp/views/*.html'
		], ['sass', 'html']);
});
// 生成发布版本，图片还没有压缩
gulp.task('build', ['clean'], function() {
	gulp.start('mincss', 'minjs');
});
gulp.task('default', ['serve', 'watch']);