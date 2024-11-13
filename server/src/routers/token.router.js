const router = require("express").Router();
const { verifyRefreshToken } = require("../middleware/verifyToken");
const generateToken = require("../utils/generateToken");
const cookieConfig = require("../configs/cookieConfig");

router.get("/refresh", verifyRefreshToken, (req, res) => {
  const { accessToken, refreshToken } = generateToken({
    user: res.locals.user,
  });

  res
    .cookie("refreshToken", refreshToken, cookieConfig.refresh)
    .json({ user: res.locals.user, accessToken });
});

module.exports = router;
