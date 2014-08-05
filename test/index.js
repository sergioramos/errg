var co = require('co');
var thunk = require('thunkify');
var assert = require('assert');
var fs = require('fs');

var intercept = function(fn){
  return function *(){
    var res, err;

    try {
      res = yield* fn.apply(fn, arguments);
    } catch(er){
      err = er;
    }

    if(Array.isArray(res) && res.__wasIntercept){
      return res;
    }

    var returns = [err, res];
    returns.__wasIntercept = true;

    return returns;
  };
};

co(function *(){
  var read = intercept(thunk(fs.readFile));
  var a = read('index.js', 'utf8');
  var c = read('package.json', 'utf8');

  // var [[erra, a], [errb, b]] = yield [a, b];
  var res = yield [a, c];
  assert(res.length === 2);
  assert(res[0][1].indexOf('exports') > 0)
  assert(res[1][1].indexOf('devDependencies') > 0)
})();

function sleep(ms) {
  return function(done){
    setTimeout(done, ms);
  };
}

co(function *(){
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
})();

co(function *(){
  var work = intercept(function *(){
    throw new Error('boom');
  });

  //var [err, a] = yield work;
  var a = yield work;

  assert(a[0] instanceof Error);
})();

co(function *(){
  function *moreWork(calls) {
    calls.push('three');
    yield sleep(50);
    calls.push('four');
  }

  var work = intercept(function *(){
    var calls = [];
    calls.push('one');
    yield sleep(50);
    calls.push('two');
    yield moreWork(calls);
    calls.push('five');
    return calls;
  });

  // var [err, calls] = yield work();
  var calls = yield work();
  assert(calls[1].length === 5);
  assert(calls[1][0] === 'one');
  assert(calls[1][1] === 'two');
  assert(calls[1][2] === 'three');
  assert(calls[1][3] === 'four');
  assert(calls[1][4] === 'five');

  var a = work();
  var b = work();
  var c = work();

  // var [[err1, calls1], [err2, calls2], [err3, calls3]] = yield work();
  var calls = yield [a, b, c];
  calls.should.eql([
    [ 'one', 'two', 'three', 'four', 'five' ],
    [ 'one', 'two', 'three', 'four', 'five' ],
    [ 'one', 'two', 'three', 'four', 'five' ] ]);
})();

it('should catch errors', function(done){
  co(function *(){
    yield function *(){
      throw new Error('boom');
    }();
  })(function(err){
    assert(err);
    assert(err.message == 'boom');
    done();
  });