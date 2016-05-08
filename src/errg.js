module.exports = async function(p) {
  let res;

  try {
    res = await p;
  } catch (err) {
    return [err, null];
  }

  return [null, ...res];
};