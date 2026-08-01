const express = require("express");
const multer = require("multer");
const musicController = require("../controllers/music.controller");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload-music",
  upload.single("music"),
  musicController.createMusic,
);

module.exports = router;
