module.exports = function(fn){
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