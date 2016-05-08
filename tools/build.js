const babel = require('babel-core');
const path = require('path');
const async = require('async');
const cp = require('cp-file');
const nodeify = require('nodeify');
const mkdirp = require('mkdirp');
const fs = require('fs');

const opts = {
  [path.join(__dirname, '../build/es5/index.js')]: {
    presets: ['es2015'],
    plugins: ['transform-async-to-generator', ['transform-runtime', {
      'polyfill': false,
      'regenerator': true
    }]],
    sourceMaps: 'both',
    compact: false
  },
  [path.join(__dirname, '../build/es6/index.js')]: {
    plugins: ['transform-async-to-generator'],
    sourceMaps: 'both',
    compact: false
  }
};

const filename = path.join(__dirname, '../src/errg.js');
const input = fs.readFileSync(filename);

const transform = function(output, fn) {
  const res = babel.transform(input, opts[output]);

  async.series({
    mkdir: function(fn) {
      mkdirp(path.dirname(output), fn);
    },
    src: function(fn) {
      fs.writeFile(output, res.code, fn);
    },
    map: function(fn) {
      fs.writeFile(`${output}.map`, JSON.stringify(res.map, null, 2), fn);
    }
  }, fn);
};

module.exports = function(fn) {
  async.forEach(Object.keys(opts), transform, function(err) {
    if (err) {
      return fn(err);
    }

    nodeify(cp(filename, path.join(__dirname, '../build/es7/index.js')), fn);
  });
};


if (!module.parent) {
  module.exports(function(err) {
    if (err) {
      throw err;
    }
  });
}
