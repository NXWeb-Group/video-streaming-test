import type { Request, Response } from "express";
import fs from "node:fs/promises";
import path from "path";
import { pool } from "./sqlconnect.js";
import { tohls } from "./ffmpeg.js";

export async function newPost(req: Request, res: Response) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).send("Unauthorized");
  }

  const { title, description } = JSON.parse(req.body.data);
  // @ts-expect-error I hate typescript
  const userId = req.user.id;

  const media = [];
  if (req.file) {
    if (req.file.mimetype.startsWith("video/")) {
      const path = await tohls(req.file);
      media.push(path);
    } else if (req.file.mimetype.startsWith("image/")) {
      const destinationDir = path.join("files", "images");
      try {
        await fs.access(destinationDir);
      } catch {
        await fs.mkdir(destinationDir, { recursive: true });
      }
      const destinationPath = path.join(destinationDir, req.file.filename);
      await fs.rename(req.file.path, destinationPath);
      media.push(destinationPath);
    }
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO posts (title, description, userId, media) VALUES (?, ?, ?, ?)",
      [title, description, userId, JSON.stringify(media)]
    );
    res.status(201).send("Post created successfully");
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).send("Error creating post");
  } finally {
    if (connection) connection.release();
  }
}
