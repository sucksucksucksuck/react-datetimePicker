/**
 * Created by sun_3211 on 2017/2/4.
 */
import gulp from 'gulp';
import browserSync from 'browser-sync';
import browserify from 'browserify';
import babelify from 'babelify';
import watchify from 'watchify'
import sourcemaps  from "gulp-sourcemaps" ;
import gulpLoadPlugins from 'gulp-load-plugins';
import LessAutoPrefix  from'less-plugin-autoprefix';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import mincss  from'gulp-clean-css';
import less  from 'gulp-less';

const $ = gulpLoadPlugins();
let opt = watchify.args;
opt.entries = ['./src/js/app.js'];
opt.debug = true;
const plugins = [
    // 'transform-object-assign',  //转换es6 Object.assign插件
    'transform-class-properties',
    //'external-helpers',  //将es6代码转换后使用的公用函数单独抽出来保存为babelHelpers
    // 'transform-runtime',
    ['transform-es2015-classes', {"loose": false}],  //转换es6 class插件
    ['transform-es2015-modules-commonjs', {"loose": false}]  //转换es6 module插件
];
const b = browserify(opt).transform(babelify, {  //此处babel的各配置项格式与.babelrc文件相同
    presets: [
        'stage-0',  //指定转换es7代码的语法提案阶段
        'react', //转换React的jsx
        'es2015',  //转换es6代码
    ],
    plugins: plugins
});

const reload = browserSync.reload;

const bundle = function () {
    //console.log("正在编译.....", new Date().format('yyyy-MM-dd hh:mm:ss'));
    const s = (
        b.bundle()
            .on('error', $.util.log.bind($.util, 'Browserify Error'))
            .pipe(source('index.js'))
            .pipe(buffer())
            .pipe(gulp.dest("www/js"))
            .pipe($.size({title: 'script'}))
    );
    s.pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write("."));
    return s;
};
gulp.task('watch-js', function () {
    b.plugin(watchify, {
        delay: 100,
        ignoreWatch: [],
        poll: false
    });  //设置watchify插件
    b.on('update', bundle)
        .on('time', $.util.log);
    return bundle();  //须要先执行一次bundle
});
gulp.task('less', function () {
    gulp.src('src/css/app.less') //该任务针对的文件
        .pipe($.rename("index.css"))
        .pipe(less({
            plugins: [new LessAutoPrefix({
                browsers: ["last 3 versions"],
                cascade: true
            })]
        })) //该任务调用的模块
        .pipe(gulp.dest('www/css'))
        .pipe($.rename({suffix: '.min'}))
        .pipe(mincss())
        .pipe(gulp.dest('www/css/'))
        .pipe($.size({
            title: 'script minify'
        }));
});
gulp.task('watch-less', function () {
    gulp.watch('src/css/**/*.less', ['less']); //当所有less文件发生改变时，调用testLess任务
});

const defaultTask = ["watch-js", "watch-less"];
gulp.task('default', defaultTask, function () {
    browserSync({
        notify: false,
        logPrefix: 'ASK',
        server: './www/'
    });
    gulp.watch(['www/**/*'], reload);
});

