# ycatch

![](http://img.shields.io/npm/v/ycatch.svg?style=flat)
![](http://img.shields.io/npm/l/ycatch.svg?style=flat)
![](http://img.shields.io/travis/ramitos/ycatch.svg?style=flat)
![](http://img.shields.io/badge/stability-experimental-orange.svg?style=flat)

## api

```js
var read = intercept(thunk(fs.readFile));
var a = read('index.js', 'utf8');
var c = read('package.json', 'utf8');

// var [[erra, a], [errb, b]] = yield [a, b]; // for when destructuring comes to node.js
var res = yield [a, c];
assert(res.length === 2);
assert(res[0][1].indexOf('exports') > 0)
assert(res[1][1].indexOf('devDependencies') > 0)
```

```js
function sleep(ms) {
  return function(done){
    setTimeout(done, ms);
  };
}

var work = intercept(function *(){
  yield sleep(50);
  return 'yay';
});

var a = yield work;
var b = yield work;
var c = yield work;

// var [, a] = yield work;
assert('yay' === a[1]);
// var [, b] = yield work;
assert('yay' === b[1]);
// var [, c] = yield work;
assert('yay' === c[1]);

var res = yield [work, work, work];
// var [[, a], [, b], [, c]] = yield [work, work, work];
assert(res.length === 3);
assert('yay' === res[0][1]);
assert('yay' === res[1][1]);
assert('yay' === res[2][1]);
```