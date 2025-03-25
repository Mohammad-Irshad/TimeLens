const User = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { setSecureCookie } = require("../services");

const userSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => field?.trim() === "")) {
      return res
        .status(400)
        .json({ message: "All fields are required, please fill all fields!" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

const userLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      return res
        .status(400)
        .json({ message: "password and email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User does not exist, Please sign up and try again" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const accessToken = jwt.sign(
      { _id: user._id, name: user.name, email: user.email },
      process.env.SECRET_TOKEN_KEY,
      { expiresIn: "1h" }
    );

    const logedInUser = await User.findById(user._id).select(
      "-password -createdAt -updatedAt"
    );

    setSecureCookie(res, accessToken);

    return res.status(200).json({
      message: "User Logedin Successfully!",
      user: logedInUser,
      accessToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
};

const validateUserEmail = async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ email });
  res.json({ isValid: !!user });
};

module.exports = {
  userLogIn,
  userSignUp,
  validateUserEmail,
};
