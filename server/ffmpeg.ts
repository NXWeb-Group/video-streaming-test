import path from "node:path";
import ffmpeg from "fluent-ffmpeg";
import fs from "node:fs/promises";

export async function tohls(file: Express.Multer.File) {
  const inputFilePath = file.path;
  const outputDir = path.join("files/hls", file.filename);
  const outputFilePath = path.join(outputDir, "index.m3u8");

  await fs.mkdir(outputDir, { recursive: true });

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
      try {
        await fs.unlink(inputFilePath); // Remove the uploaded MP4 file
      } catch (err) {
        console.error("Error inserting file path into database:", err);
      }
    })
    .on("error", (err) => {
      console.error(err);
    })
    .run();

  return outputFilePath;
}
