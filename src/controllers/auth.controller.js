const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function registerUser(req, res) {
  const { username, email, password, role = "user" } = req.body;

  const isUserExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserExists) {
    return res.status(409).json({
      message: "User already exists.",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
    role,
  });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "user created successfully.",
    username: user.username,
    email: user.email,
    role: user.role,
  });
}

async function loginUser(req, res) {
  const { username, email, password, role } = req.body;

  const user = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    return res.status(401).json({
      message: "user not found.",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "User login successfully",
    username: user.username,
    email: user.email,
    role: user.role,
  });
}

module.exports = { registerUser, loginUser };
