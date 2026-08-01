const jwt = require("jsonwebtoken");
const musicModel = require("../models/music.model");
const { uploadFile } = require("../services/storage.service");

async function createMusic(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "artist") {
      return res.status(401).json({
        message: "You don't have access to create music",
      });
    }

    const { title } = req.body;
    const file = req.file;

    const result = await uploadFile(file.buffer.toString("base64"));

    const music = await musicModel.create({
      title: title,
      music: result.url,
      artist: decoded.id,
    });

    res.status(201).json({
      message: "music uploaded successfully",
      id: music._id,
      title: music.title,
      music: music.music,
      artist: music.artist,
    });
  } catch (err) {
    res.status(401).json({
      message: "Unauthorized: token not valid." + err.message,
    });
  }
}

module.exports = { createMusic };
