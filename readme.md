# ycatch

![](http://img.shields.io/npm/v/ycatch.svg?style=flat)  ![](http://img.shields.io/npm/l/ycatch.svg?style=flat)  ![](http://img.shields.io/badge/stability-experimental-orange.svg?style=flat)

Probably useless until node has [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). It can be used without it though.

## api

```js
var read = intercept(thunk(fs.readFile));
var a = read('index.js', 'utf8');
var c = read('package.json', 'utf8');

var [[erra, a], [errb, b]] = yield [a, b];
if(erra) throw erra;
if(errb) throw errb;
assert(a.indexOf('exports') > 0)
assert(b.indexOf('devDependencies') > 0)
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

var [, a] = yield work;
assert('yay' === a);
var [, b] = yield work;
assert('yay' === b);
var [, c] = yield work;
assert('yay' === c);

var [[, a], [, b], [, c]] = yield [work, work, work];
assert('yay' === a);
assert('yay' === b);
assert('yay' === c);
```