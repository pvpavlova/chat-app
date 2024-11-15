const router = require("express").Router();
const { User } = require("../../db/models");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const cookieConfig = require("../configs/cookieConfig");

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username && email && password)) {
    return res.status(400).json({ message: "Необходимо заполнить все поля" });
  }

  try {
    const [user, isCreated] = await User.findOrCreate({
      where: { email },
      defaults: { username, email, password: await bcrypt.hash(password, 10) },
    });

    if (!isCreated) {
      return res.status(400).json({ message: "Такой пользователь существует" });
    }

    const plainUser = user.get();
    delete plainUser.password;

    const { accessToken, refreshToken } = generateToken({ user: plainUser });

    return res
      .cookie("refreshToken", refreshToken, cookieConfig.refresh)
      .json({ user: plainUser, accessToken });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Ошибка сервера" });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return res.status(400).json({ message: "Необходимо заполнить все поля" });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Некорректный email или пароль" });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(400).json({ message: "Некорректный email или пароль" });
    }

    const plainUser = user.get();
    delete plainUser.password;

    const { accessToken, refreshToken } = generateToken({ user: plainUser });

    return res
      .cookie("refreshToken", refreshToken, cookieConfig.refresh)
      .json({ user: plainUser, accessToken });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Ошибка сервера" });
  }
});

router.get("/logout", async (req, res) => {
  try {
    res.clearCookie("refreshToken").sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
});

module.exports = router;
