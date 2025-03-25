function setSecureCookie(res, token, name) {
  res.cookie(name, token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    maxAge: 60 * 60 * 1000,
  });

  return res;
}

module.exports = { setSecureCookie };
