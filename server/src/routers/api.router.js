const router = require("express").Router();
const tokenRouter = require("./token.router");
const authRouter = require("./auth.router");
const postsRouter = require("./posts.router");
const usersRouter = require("./users.router");

router.use("/token", tokenRouter);
router.use("/auth", authRouter);
router.use("/posts", postsRouter);
router.use("/users", usersRouter);

module.exports = router;
