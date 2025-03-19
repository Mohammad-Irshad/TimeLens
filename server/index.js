const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { initializeDatabase } = require("./database/db");
const {
  googleAuthCallback,
  googleAuth,
  getUserGoogleProfile,
} = require("./controllers/googleOauth.controller");
const {
  userSignUp,
  userLogIn,
  validateUserEmail,
} = require("./controllers/user.controller");
const {
  addNewAlbum,
  updateAlbum,
  deleteAlbum,
  getAllAlbums,
  getAllSharedAlbums,
} = require("./controllers/album.controller");
const {
  uploadImage,
  getAllImages,
  updateImage,
  deleteImage,
  getTheAlbumImages,
} = require("./controllers/image.controller");
const multer = require("multer");
const { verifyGoogelAccessToken, verifyJWT } = require("./middleware");

require("dotenv").config();

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 4000;

app.use(cors());

// app.use(
//   cors({
//     origin: "https://timelens-webapp.vercel.app", // Allow frontend domain
//     credentials: true, // Allow cookies & authentication headers
//   })
// );
app.use(express.json());

// Multer

const storage = multer.diskStorage({});
const upload = multer({ storage });

initializeDatabase();

app.get("/", (req, res) => {
  res.send("Welcome to Mohammad Irshad's server!");
});

// Google OAUTH API's

app.get("/auth/google", googleAuth);

app.get("/auth/google/callback", googleAuthCallback);

app.get("/user/profile/google", verifyGoogelAccessToken, getUserGoogleProfile);

// User SignUp and LogIn API's

app.post("/userLogin", userLogIn);
app.post("/userSignup", userSignUp);
app.get("/user/validate-user-email", validateUserEmail);

// Album API's

app.post("/albums", verifyJWT, addNewAlbum);
app.get("/getAlbums/:ownerId", verifyJWT, getAllAlbums);
app.put("/albums/:albumId", verifyJWT, updateAlbum);
app.delete("/albums/:albumId", verifyJWT, deleteAlbum);
app.get("/albums/:emailId/share", verifyJWT, getAllSharedAlbums);

// Photo API's

app.get("/images", verifyJWT, getAllImages);
app.get("/images/:albumId", verifyJWT, getTheAlbumImages);
app.post(
  "/albums/:albumId/images",
  verifyJWT,
  upload.single("image"),
  uploadImage
);
app.put("/images/:imageId", verifyJWT, updateImage);
app.delete("/images/:imageId", verifyJWT, deleteImage);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
