const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  music: {
    type: String,
    required: true,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
});

const musicModel = mongoose.model("music", musicSchema);

module.exports = musicModel;
