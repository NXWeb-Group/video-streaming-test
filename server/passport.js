import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { pool } from "./sqlconnect.js";
import bcrypt from "bcrypt";

passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.query(
        "SELECT * FROM accounts WHERE username = ?",
        [username]
      );
      console.log(rows);
      const user = rows[0];
      if (!user) {
        return cb(null, false, { message: "Incorrect username or password." });
      }

      const match = await bcrypt.compare(password, user.hashed_password);
      if (!match) {
        return cb(null, false, { message: "Incorrect username or password." });
      }

      return cb(null, user);
    } catch (err) {
      return cb(err);
    } finally {
      if (connection) connection.release();
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM accounts WHERE id = ?",
      [id]
    );
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  } finally {
    if (connection) connection.release();
  }
});
