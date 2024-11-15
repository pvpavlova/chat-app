require("dotenv").config();
const apiRouter = require("./routers/api.router");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const router = express.Router();
const { PORT } = process.env;

const corsConfig = {
  origin: ["http://localhost:5173"],
  credentials: true,
};
app.use(cors(corsConfig));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });
app.post("/upload", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const filePath = `/uploads/${req.file.filename}`;
  res.status(200).json({ filePath });
});

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/v1", apiRouter);

app.listen(PORT, () => {
  console.log(`Server started at ${PORT} port`);
});
