var gulp = require('gulp'),
    pug = require('gulp-pug'),
    jscs = require('gulp-jscs'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-cssnano'),
    uncss = require('gulp-uncss'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    cssimport = require('gulp-cssimport'),
    beautify = require('gulp-beautify'),
    sourcemaps = require('gulp-sourcemaps'),
    critical = require('critical').stream,
    iconfont = require('gulp-iconfont')
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename');

/* baseDirs: baseDirs for the project */

var runTimestamp = Math.round(Date.now()/1000);

var baseDirs = {
    dist:'dist/',
    src:'src/',
    assets: 'dist/assets/'
};

/* routes: object that contains the paths */

var routes = {
    styles: {
        scss: baseDirs.src+'styles/*.scss',
        _scss: baseDirs.src+'styles/_includes/*.scss',
        css: baseDirs.assets+'css/'
    },

    templates: {
    	pug: baseDirs.src+'templates/*.pug',
      _pug: baseDirs.src+'templates/_includes/*.pug',
      _components: baseDirs.src+'templates/_components/*.pug',
    },

    fonts: {
      src: baseDirs.src+'fonts/*',
    },

    scripts: {
        base:baseDirs.src+'scripts/',
        js: baseDirs.src+'scripts/*.js',
        jsmin: baseDirs.assets+'js/'
    },

    files: {
        html: 'dist/',
        images: baseDirs.src+'images/*',
        fonts: baseDirs.src+'fonts/*',
        basejs: 'index.js',
        libsjs: 'libs.js',
        icons: baseDirs.src+'images/icons/*',
        imgmin: baseDirs.assets+'files/img/',
        iconmin: baseDirs.assets+'files/img/icons/',
        cssFiles: baseDirs.assets+'css/*.css',
        htmlFiles: baseDirs.dist+'*.html',
        styleCss: baseDirs.assets+'css/style.css',
        fonts: baseDirs.assets+'files/fonts/'
    },

    deployDirs: {
        baseDir: baseDirs.dist,
        baseDirFiles: baseDirs.dist+'**/*',
        ftpUploadDir: 'FTP-DIRECTORY'
    }
};

/* Compiling Tasks */

// Templating

gulp.task('templates', function() {
    return gulp.src([routes.templates.pug, '!' + routes.templates._pug])
        .pipe(pug())
        .pipe(gulp.dest(routes.files.html))
        .pipe(browserSync.stream())
});

// SCSS

gulp.task('styles', function() {
    return gulp.src(routes.styles.scss)
        .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(autoprefixer('last 3 versions'))
        .pipe(sourcemaps.write())
        .pipe(cssimport({}))
        .pipe(rename('style.css'))
        .pipe(gulp.dest(routes.styles.css))
        .pipe(browserSync.stream())
});

/* Icons */

gulp.task('svg-generator', function() {
    return gulp.src(routes.files.icons)
       .pipe(svgmin())
       .pipe(svgstore())
       .pipe(rename('icons.svg'))
       .pipe(gulp.dest(routes.files.imgmin));
});

/* Libs (js) ES6 => ES5, minify and concat into a single file.*/

gulp.task('libs', function() {
    return gulp.src(
      [
        './node_modules/wings-foundation/src/scripts/progress.js',
        './node_modules/wings-foundation/src/scripts/utils.js',
        './src/scripts/tabs.js',
        './src/scripts/forms.js'
      ]
    )
        .pipe(concat(routes.files.libsjs))
        .pipe(sourcemaps.init())
            .pipe(babel())
            .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(routes.scripts.jsmin))
        .pipe(browserSync.stream())
});

/* Scripts (js) ES6 => ES5, minify and concat into a single file.*/

gulp.task('components', function() {
    return gulp.src(['src/templates/_includes/**/*.js', routes.scripts.js])
        .pipe(concat(routes.files.basejs))
        .pipe(sourcemaps.init())
            .pipe(babel())
            .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(routes.scripts.jsmin))
        .pipe(browserSync.stream())
});

/* Lint, lint the JavaScript files */

gulp.task('lint', function() {
	return gulp.src(routes.scripts.js)
		.pipe(jscs())
		.pipe(jscs.reporter());
});

/* Image compressing task */

gulp.task('images', function() {
    gulp.src(routes.files.images)
        .pipe(imagemin())
        .pipe(gulp.dest(routes.files.imgmin));
});

/* Icons copying task */

gulp.task('icons', function() {
    gulp.src(routes.files.icons)
      .pipe(gulp.dest(routes.files.iconmin))
});

/* Fonts copying task */

gulp.task('fonts', function() {
    gulp.src(routes.fonts.src)
        .pipe(gulp.dest(routes.files.fonts));
});

/* Preproduction beautifiying task (SCSS, JS) */

gulp.task('beautify', function() {
    gulp.src(routes.scripts.js)
        .pipe(beautify({indentSize: 4}))
        .pipe(gulp.dest(routes.scripts.base))
});

/* Serving (browserSync) and watching for changes in files */

gulp.task('serve', function() {
    browserSync.init({
        server: './dist/'
    });

    gulp.watch([routes.styles.scss, routes.styles._scss, 'src/templates/**/*.scss'], ['styles']);
    gulp.watch([routes.templates.pug, routes.templates._pug, routes.templates._components], ['templates']);
    gulp.watch(routes.scripts.js, ['components']);
    gulp.watch(routes.files.images, ['images']);
    gulp.watch(routes.fonts.src, ['fonts']);
});

/* Optimize your project */

gulp.task('uncss', function() {
    return gulp.src(routes.files.cssFiles)
        .pipe(uncss({
            html:[routes.files.htmlFiles],
            ignore:['*:*']
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest(routes.styles.css))
});

/* Extract CSS critical-path */

gulp.task('critical', function () {
    return gulp.src(routes.files.htmlFiles)
        .pipe(critical({
            base: baseDirs.dist,
            inline: true,
            html: routes.files.htmlFiles,
            css: routes.files.styleCss,
            ignore: ['@font-face',/url\(/],
            width: 1300,
            height: 900
        }))
        .pipe(gulp.dest(baseDirs.dist))
});

gulp.task('dev', ['templates', 'styles', 'components', 'libs', 'images', 'icons', 'svg-generator', 'fonts', 'serve']);

gulp.task('build', ['templates', 'styles',  'components', 'libs', 'images', 'icons', 'svg-generator', 'fonts']);

gulp.task('optimize', ['uncss', 'critical', 'images']);

gulp.task('deploy', ['optimize',  ]);

gulp.task('default', function() {
    gulp.start('dev');
});
