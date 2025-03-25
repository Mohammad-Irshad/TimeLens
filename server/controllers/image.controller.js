const mongoose = require("mongoose");
const Image = require("../model/image.model");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send("No file uploaded!");

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "TimeLens",
    });

    const newImage = new Image({
      imageUrl: result.secure_url,
      albumId: req.body.albumId,
      ownerId: req.body.ownerId,
      name: req.body.name,
      tags: JSON.parse(req.body.tags || "[]"),
      persons: JSON.parse(req.body.persons || "[]"),
      size: req.file.size,
    });

    const savedImage = await newImage.save();

    res.status(200).json({
      message: "Image uploaded successfully",
      uploadedImage: savedImage,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res
      .status(500)
      .json({ message: "Image upload failed", error: error.message });
  }
};

const getAllImages = async (req, res) => {
  const ownerId = req.headers["logedinuserid"];
  try {
    const allImages = await Image.find({ ownerId });
    res.status(200).json({ message: "Image fetched successfully!", allImages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Image fetch failed!", error: error });
  }
};

const getTheAlbumImages = async (req, res) => {
  try {
    const albumId = req.params.albumId;

    if (!albumId) {
      console.error("Error: albumId is missing from request params.");
      return res.status(400).json({ message: "Album ID is required." });
    }

    const albumImages = await Image.find({ albumId });

    if (!albumImages.length) {
      console.warn(`No images found for albumId: ${albumId}`);
      return res
        .status(404)
        .json({ message: "No images found for this album." });
    }

    return res.status(200).json({
      message: "Images fetched successfully",
      albumImages,
    });
  } catch (error) {
    console.error("Error fetching album images:", error);
    return res.status(500).json({
      message: "Image fetch failed!",
      error: error.message,
    });
  }
};

const updateImage = async (req, res) => {
  const imgId = req.params.imageId;
  const updatedData = req.body;
  try {
    const updatedImage = await Image.findByIdAndUpdate(imgId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedImage) {
      return res.status(400).json({ message: "Image not found" });
    }

    res
      .status(200)
      .json({ message: "Image updated successfully!", updatedImage });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to update image", error: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const imgId = req.params.imageId;
    const deletedImage = await Image.findByIdAndDelete(imgId);
    if (!deletedImage) {
      return res.status(400).json({ message: "Image not found" });
    }
    res
      .status(200)
      .json({ messaeg: "Image deleted successfully!", deletedImage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete the image." });
  }
};

module.exports = {
  uploadImage,
  getAllImages,
  updateImage,
  deleteImage,
  getTheAlbumImages,
};
