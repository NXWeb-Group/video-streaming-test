import "dotenv/config";
import express from "express";
import path from "node:path";
import session from "express-session";
import MySQLStore from "express-mysql-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import { api } from "./server/api.js";
import { pool } from "./server/sqlconnect.js";
import "./server/passport.js";

const port = 8080;
const app = express();

// @ts-expect-error idk
const MySQLStoreSession = MySQLStore(session);
// @ts-expect-error idk
const sessionStore = new MySQLStoreSession({}, pool);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/files/", express.static("files"));
app.use(express.static("dist/vue"));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/", api);

app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "dist/vue/index.html"));
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
