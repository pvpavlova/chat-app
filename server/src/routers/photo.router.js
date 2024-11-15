const express = require("express");
const router = express.Router();
const getUserPhotos = require("../services/getUserPhotos");

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const photos = await getUserPhotos(userId);
    res.json(photos);
  } catch (error) {
    res.status(500).send("Ошибка при получении фотографий");
  }
});

module.exports = router;
