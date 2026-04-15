const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

// ✅ Ensure datasets folder exists (IMPORTANT for Render)
const DATASET_DIR = path.join(__dirname, "datasets");

if (!fs.existsSync(DATASET_DIR)) {
  fs.mkdirSync(DATASET_DIR);
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DATASET_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// ✅ Upload API
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    message: "File uploaded successfully",
    file: req.file.originalname
  });
});

// ✅ Get dataset API
app.get("/datasets/:name", (req, res) => {
  const filePath = path.join(DATASET_DIR, `${req.params.name}.csv`);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "Dataset not found" });
  }
});

// ✅ List datasets (safe version)
app.get("/datasets", (req, res) => {
  try {
    const files = fs.readdirSync(DATASET_DIR);
    res.json(files);
  } catch (err) {
    res.json([]); // fallback instead of crash
  }
});

// Root route (optional but useful)
app.get("/", (req, res) => {
  res.send("Dataset Server Running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
