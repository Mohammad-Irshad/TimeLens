const mongoose = require("mongoose");
const Album = require("./album.model");
const User = require("./user.model");

const imageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Album,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    name: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    persons: {
      type: [String],
      default: [],
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    comments: [
      {
        userName: String,
        userEmail: String,
        userComment: String,
      },
    ],
    size: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
