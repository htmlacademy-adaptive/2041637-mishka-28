import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import csso from 'gulp-csso';
import rename from 'gulp-rename';
import squoosh from 'gulp-squoosh';
import { deleteAsync } from 'del';
import svgstore from 'gulp-svgstore';
import svgo from 'gulp-svgmin';
import cheerio from 'gulp-cheerio';
import { compile } from 'gulp-nunjucks';

// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('source/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

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

const htmlSource = () => {
  return gulp.src('source/pages/*.html')
  .pipe(compile())
  .pipe(gulp.dest('source'));
}

// Scripts

const scripts = () => {
  return gulp.src('source/js/script.js')
  .pipe(gulp.dest('build/js'))
  .pipe(browser.stream());
}

// Images

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'))
}

// WebP

const createWebp = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
  .pipe(squoosh({
  webp: {}
  }))
  .pipe(gulp.dest('build/img'))
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
  // .pipe(svgo())
  .pipe(svgstore({
  inlineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
}

const spriteSource = () => {
  return gulp.src('source/img/icons/*.svg')
  .pipe(cheerio({
    run: ($) => {
        $('path').attr('fill', 'currentColor');
    },
    parserOptions: { xmlMode: true }
  }))
  .pipe(svgstore({
  inlineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('source/img'));
}

// Copy

const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
    ], { base: 'source' })
    .pipe(gulp.dest('build'))
    done();
}

// Clean

const clean = () => {
  return deleteAsync('build');
};

const cleanSource = () => {
  return deleteAsync(['source/index.html', 'source/catalog.html', 'source/form.html']);
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

const serverBuild = (done) => {
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

// // Reload

// const reload = (done) => {
//   browser.reload();
//   done();
// }

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/pages/**/*.html').on('change', gulp.series(cleanSource, htmlSource, browser.reload));
}

// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    optimizeStyles,
    html,
    scripts,
    svg,
    sprite,
    createWebp
  ),
  serverBuild
);

export default gulp.series(
  cleanSource, spriteSource, htmlSource, styles, server, watcher
);
