const router = require("express").Router();
const { Post, User } = require("../../db/models");
const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating user" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching user" });
  }
});

router.put(
  "/:id",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ]),
  async (req, res) => {
    const userId = req.params.id;
    const { username, email, description, city } = req.body;

    const profilePicture = req.files?.profilePicture
      ? req.files.profilePicture[0].path
      : null;
    const coverPicture = req.files?.coverPicture
      ? req.files.coverPicture[0].path
      : null;

    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.username = username;
      user.email = email;
      user.description = description;
      user.city = city;
      if (profilePicture) user.profilePicture = profilePicture;
      if (coverPicture) user.coverPicture = coverPicture;

      await user.save();

      res.json({
        userId,
        username,
        email,
        description,
        city,
        profilePicture: user.profilePicture,
        coverPicture: user.coverPicture,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting user" });
  }
});

module.exports = router;
