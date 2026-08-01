const imagekit = require("@imagekit/nodejs");

const client = new imagekit({
  privateKey: process.env.PRIVATE_KEY,
});

async function uploadFile(file) {
  const result = await client.files.upload({
    file,
    fileName: "music_" + Date.now(),
    folder: "music/",
  });

  return result;
}

module.exports = { uploadFile };
