const mongoose = require("mongoose");
const User = require("./user.model");

const albumSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    sharedWith: {
      type: [String],
    },
  },
  { timestamps: true }
);

const Album = mongoose.model("Album", albumSchema);

module.exports = Album;
