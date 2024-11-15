const router = require("express").Router();
const { Post, User } = require("../../db/models");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Указываем папку для сохранения файлов
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname) // Имя файла будет уникальным
    );
  },
});

const upload = multer({ storage: storage });

// Используем в маршруте:
router.post("/", upload.single("image"), async (req, res) => {
  const { description, userId } = req.body;
  const imgPath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newPost = await Post.create({
      userId,
      description,
      img: imgPath,
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: "Ошибка при создании поста" });
  }
});

// изменить пост
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (post && post.userId === req.body.userId) {
      await post.update(req.body);
      res.status(200).json("The post has been updated");
    } else {
      res.status(403).json("You can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const post = await Post.findByPk(req.params.id);

    if (post && String(post.userId) === String(req.body.userId)) {
      await post.destroy();
      res.status(200).json("The post has been deleted");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// поставить/убрать лайк
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json("Post not found");

    // Логика для лайка/дизлайка
    const likes = post.likes || [];
    if (!likes.includes(req.body.userId)) {
      likes.push(req.body.userId);
      await post.update({ likes });
      res.status(200).json("The post has been liked");
    } else {
      post.likes = likes.filter((id) => id !== req.body.userId);
      await post.update({ likes });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// получить пост
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// все посты пользователя
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findByPk(req.params.userId);

    if (!currentUser) return res.status(404).json("User not found");

    const userPosts = await Post.findAll({ where: { userId: currentUser.id } });

    res.status(200).json([...userPosts]);
  } catch (err) {
    res.status(500).json(err);
  }
});

// все посты пользователя по имени
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
    });
    if (!user) return res.status(404).json("User not found");

    const posts = await Post.findAll({ where: { userId: user.id } });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
