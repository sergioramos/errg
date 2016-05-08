# errg

[![](https://img.shields.io/travis/ramitos/errg.svg)](https://travis-ci.org/ramitos/errg) [![](https://img.shields.io/codeclimate/coverage/github/ramitos/errg.svg)](https://codeclimate.com/github/ramitos/errg/coverage) [![](https://img.shields.io/npm/v/errg.svg)](https://www.npmjs.com/package/errg) [![](https://img.shields.io/david/ramitos/errg.svg)](https://david-dm.org/ramitos/errg) [![](https://img.shields.io/codeclimate/github/ramitos/errg.svg)](https://codeclimate.com/github/ramitos/errg) [![](https://img.shields.io/npm/l/errg.svg)](https://www.npmjs.com/package/errg)

## api

```js
var errg = require('errg/es5');
// errg/es6 and errg/es7 also possible

var read = async function() {
  // some async op
  throw err;
};

var main = async function() {
  var [err, res] = await errg(read());
  if (err) {
    throw err;
  }
  
  // ignoring err
  var [, res] = await errg(read());
  
  // traditional try/catch
  try {
    var res = read();
  } catch(err) {
    // got the err here
  }
  
  // bubble err
  var res = read();
};
```

## license

MIT