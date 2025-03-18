// helper function

function setSecureCookie(res, token, name) {
  res.cookie(name, token, {
    httpOnly: true,
    maxAge: 60 * 1000,
  });

  return res;
}

module.exports = { setSecureCookie };
