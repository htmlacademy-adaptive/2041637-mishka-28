import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import csso from 'gulp-csso';
import rename from 'gulp-rename';
import squoosh from  'gulp-squoosh';
import { deleteAsync } from 'del';
import svgstore from 'gulp-svgstore';
import svgo from 'gulp-svgmin';
import cheerio from 'gulp-cheerio';
import { compile } from 'gulp-nunjucks';
import * as path from 'path';
// Styles

const optimizeStyles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML

const html = () => {
  return gulp.src('source/pages/*.html')
  .pipe(compile())
  .pipe(gulp.dest('build'));
}

// Scripts

const scripts = () => {
  return gulp.src('source/js/script.js')
  .pipe(gulp.dest('build/js'))
  .pipe(browser.stream());
}

// Images

const optimizeImages = () => {
  return gulp.src('source/img/*.{png,jpg}')
  .pipe(squoosh(({ filePath }) => ({
    encodeOptions: {
      webp: {},
      ... (path.extname(filePath) === ".png" ? { oxipng: {} } : { mozjpeg: {} }),
    },
  })))
  .pipe(gulp.dest('build/img'));
}

// SVG

const svg = () =>
  gulp.src(['source/img/*.svg', '!source/img/sprite.svg', '!source/img/icons/*.svg', '!source/img/sprite2.svg'])
  .pipe(svgo())
  .pipe(gulp.dest('build/img'));

const sprite = () => {
  return gulp.src('source/img/icons/*.svg')
  .pipe(cheerio({
    run: ($) => {
        $('path').attr('fill', 'currentColor');
    },
    parserOptions: { xmlMode: true }
  }))
  .pipe(svgo())
  .pipe(svgstore({
  inlineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
}

// Copy

const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
    'source/img/favicons/*.*',
    ], { base: 'source' })
    .pipe(gulp.dest('build'))
    done();
}

// Clean

const clean = () => {
  return deleteAsync('build');
};

// Server

const server = (done) => {
  browser.init({
  server: {
  baseDir: 'build'
  },
  cors: true,
  notify: false,
  ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(optimizeStyles));
  gulp.watch('source/pages/**/*.html').on('change', gulp.series(html, browser.reload));
}

// Build

export const build = gulp.series(
  clean,
  copy,
  gulp.parallel(
    optimizeStyles,
    html,
    scripts,
    svg,
    sprite,
    optimizeImages,
  )
);

export default gulp.series(
  clean,
  copy,
  gulp.parallel(
    optimizeStyles,
    html,
    scripts,
    svg,
    sprite,
    optimizeImages,
  ),
  server,
  watcher
);
