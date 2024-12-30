import "dotenv/config";
import express from "express";
import path from "node:path";
import multer from "multer";
import ffmpeg from "fluent-ffmpeg";
import fs from "node:fs";
import type { Connection } from "mysql2/promise";

import initializeDatabase from "./server/sqlconnect.js";

const port = 8080;
const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.urlencoded({ extended: true }));
app.use(express.static("dist/vue"));
app.use("/hls", express.static("hls"));

let db: Connection;
initializeDatabase().then((connection) => {
  console.log("Connected to database.");
  db = connection;
  db.query(`
    CREATE TABLE IF NOT EXISTS videos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      path VARCHAR(255) NOT NULL
    )
  `);
});

app.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
  } else {
    const inputFilePath = req.file.path;
    const outputDir = path.join("hls", req.file.filename);
    const outputFilePath = path.join(outputDir, "index.m3u8");

    fs.mkdirSync(outputDir, { recursive: true });

    ffmpeg(inputFilePath)
      .outputOptions([
        "-codec: copy",
        "-start_number 0",
        "-hls_time 10",
        "-hls_list_size 0",
        "-f hls",
      ])
      .output(outputFilePath)
      .on("end", async () => {
        fs.unlinkSync(inputFilePath); // Remove the uploaded MP4 file
        try {
          await db.query("INSERT INTO videos (path) VALUES (?)", [
            outputFilePath,
          ]);
          res.send("File converted and saved.");
        } catch (err) {
          console.error("Error inserting file path into database:", err);
          res.status(500).send("Error saving file path.");
        }
      })
      .on("error", (err) => {
        console.error(err);
        res.status(500).send("Error converting file.");
      })
      .run();
  }
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
