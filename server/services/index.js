// Updated helper function

function setSecureCookie(res, token, name) {
  res.cookie(name, token, {
    httpOnly: true, // Prevent access to cookie from JS
    secure: true, // Required for HTTPS
    sameSite: "None", // Cross-site cookie requirement
    path: "/", // Make the cookie available across all paths
    maxAge: 60 * 60 * 1000, // 1 hour expiration time (changed from 1 minute)
  });

  return res;
}

module.exports = { setSecureCookie };
