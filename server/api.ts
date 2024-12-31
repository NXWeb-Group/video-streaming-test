import express from "express";
import multer from "multer";
import passport from "passport";
import bcrypt from "bcrypt";

import { pool } from "./sqlconnect.js";
import { newPost } from "./post.js";

const router = express.Router();
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 100 * 1024 * 1024 },
});

//login
router.post(
  "/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  })
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.post("/signup", async function (req, res, next) {
  try {
    const saltRounds = 8;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        "INSERT INTO accounts (username, hashed_password) VALUES (?, ?)",
        [req.body.username, hashedPassword]
      );
      const user = {
        //@ts-expect-error idk
        id: result.insertId,
        username: req.body.username,
      };

      req.login(user, function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    } finally {
      connection.release();
    }
  } catch (err) {
    return next(err);
  }
});

//post
// router.post(
//   "/newPost",
//   passport.authenticate("local", { session: true }),
//   async (req, res, next) => {
//     try {
//       newPost(req, res);
//     } catch (err) {
//       next(err);
//     }
//   }
// );

router.post("/newPost", upload.single("media"), async (req, res, next) => {
  try {
    newPost(req, res);
  } catch (err) {
    next(err);
  }
});

router.get("/get", async (req, res, next) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT id, title FROM posts");
    res.send(rows);
  } catch (err) {
    next(err);
  } finally {
    if (connection) connection.release();
  }
});

router.get("/get/:postid", async (req, res, next) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      `
      SELECT posts.title, posts.description, posts.media, accounts.username
      FROM posts
      JOIN accounts ON posts.userId = accounts.id
      WHERE posts.id = ?
    `,
      [req.params.postid]
    );
    // @ts-expect-error idk
    if (rows.length > 0) {
      // @ts-expect-error idk
      rows[0].media = JSON.parse(rows[0].media);
    }
    // @ts-expect-error idk
    res.send(rows[0]);
  } catch (err) {
    next(err);
  } finally {
    if (connection) connection.release();
  }
});

router.use((req, res) => {
  res.status(404).send({ status: "error", message: "Not Found" });
});

router.use((error: unknown, req: express.Request, res: express.Response) => {
  console.error(error);
  res.status(500).send({ status: "error", message: "Internal Server Error" });
});

export const api = router;
