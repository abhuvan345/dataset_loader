const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "datasets/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // keep original name
  }
});

const upload = multer({ storage });

// Upload API
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ message: "File uploaded successfully" });
});

// Get dataset API
app.get("/datasets/:name", (req, res) => {
  const filePath = `datasets/${req.params.name}.csv`;

  if (fs.existsSync(filePath)) {
    res.sendFile(__dirname + "/" + filePath);
  } else {
    res.status(404).json({ error: "Dataset not found" });
  }
});

// List datasets
app.get("/datasets", (req, res) => {
  const files = fs.readdirSync("datasets");
  res.json(files);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});