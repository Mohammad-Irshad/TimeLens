const Album = require("../model/album.model");
const mongoose = require("mongoose");

const addNewAlbum = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name)
      return res.status(400).json({ message: "Album must have a name!" });

    const newAlbum = await Album.create(req.body);

    res
      .status(200)
      .json({ message: "Album added successfully.", album: newAlbum });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to add project.", error: error.message });
  }
};

const getAllAlbums = async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!ownerId) {
      return res.status(400).json({ message: "Owner ID is required" });
    }

    const albums = await Album.find({ ownerId }).sort({ createdAt: -1 });

    res.status(200).json({ message: "Albums fetched successfully!", albums });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch albums", error: error.message });
  }
};

const updateAlbum = async (req, res) => {
  try {
    const theAlbumId = req.params.albumId;
    const updatedData = req.body;

    const updatedAlbum = await Album.findByIdAndUpdate(
      theAlbumId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAlbum) {
      return res.status(404).json({ message: "Album not found" });
    }
    res
      .status(200)
      .json({ message: "Album updated successfully", updatedAlbum });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to update album", error: error.message });
  }
};

const deleteAlbum = async (req, res) => {
  try {
    const theAlbumId = req.params.albumId;

    if (!mongoose.Types.ObjectId.isValid(theAlbumId)) {
      return res.status(400).json({ message: "Invalid album ID" });
    }

    const deletedAlbum = await Album.findByIdAndDelete(theAlbumId);

    if (!deletedAlbum) {
      return res.status(404).json({ message: "Album not found" });
    }

    res
      .status(200)
      .json({ message: "Album deleted successfully", deletedAlbum });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to delete the album", error: error.message });
  }
};

const getAllSharedAlbums = async (req, res) => {
  try {
    const userEmailId = req.params.emailId;

    if (!userEmailId) {
      return res.status(400).json({ message: "User email ID is required" });
    }

    const sharedAlbums = await Album.find({ sharedWith: userEmailId }).sort({
      createdAt: -1,
    });

    res
      .status(200)
      .json({ message: "Shared albums fetched successfully!", sharedAlbums });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch shared albums!",
      error: error.message,
    });
  }
};

module.exports = {
  addNewAlbum,
  getAllAlbums,
  updateAlbum,
  deleteAlbum,
  getAllSharedAlbums,
};
