require("dotenv").config();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const { setSecureCookie } = require("../services");

const PORT = process.env.PORT || 4000;

const googleAuth = (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:${PORT}/auth/google/callback&response_type=code&scope=profile email`;

  res.redirect(googleAuthUrl);
};

const googleAuthCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send("Authorization code not provided.");
  }

  try {
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: `http://localhost:${PORT}/auth/google/callback`,
      },
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const { id, name, email, picture } = userResponse.data;

    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create new one
      user = new User({
        googleId: id,
        name,
        email,
        profilePicture: picture,
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      { _id: user._id, name: user.name, email: user.email },
      process.env.SECRET_TOKEN_KEY,
      { expiresIn: "1h" }
    );

    setSecureCookie(res, accessToken, "google_access_token");

    res.redirect(
      `${process.env.FRONTEND_URL}/v2/profile/google?access_token=${jwtToken}`
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Google Authentication Failed");
  }
};

const getUserGoogleProfile = async (req, res) => {
  try {
    console.log("inside getUserGoogleProfile");
    const { google_access_token: access_token } = req.cookies;

    const googleUserDataResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    let googleId = googleUserDataResponse.data.id;

    let user = await User.findOne({ googleId });
    // console.log("User data at backend is : ", googleUserDataResponse.data);
    res.json(user);
  } catch (error) {
    console.error(
      "Google API request failed:",
      error?.response?.status,
      error?.response?.data
    );
    res.status(500).json({ error: "Could not fetch user Google profile." });
  }
};

module.exports = { googleAuth, googleAuthCallback, getUserGoogleProfile };
