import path from "node:path";
import type { Request, Response } from "express";
import ffmpeg from "fluent-ffmpeg";
import fs from "node:fs";

import { db } from "./sqlconnect.js";

export function tohls(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
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
