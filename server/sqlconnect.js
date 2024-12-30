import mysql from "mysql2/promise";

export default async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS idk`);
    await connection.query(`USE idk`);
    console.log("Database ensured.");
  } catch (err) {
    console.error("Error ensuring database and table:", err.stack);
  }

  return connection;
}
