import "dotenv/config";
import express from "express";
import path from "node:path";
import multer from "multer";

import { db } from "./server/sqlconnect.js";
import { tohls } from "./server/ffmpeg.js";

const port = 8080;
const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.urlencoded({ extended: true }));
app.use(express.static("dist/vue"));
app.use("/hls", express.static("hls"));

app.post("/upload", upload.single("video"), (req, res) => {
  tohls(req, res);
});

app.get("/get", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM videos");
    res.send(rows);
  } catch (err) {
    console.error("Error getting videos:", err);
    res.status(500).send("Error getting videos.");
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "dist/vue/index.html"));
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
