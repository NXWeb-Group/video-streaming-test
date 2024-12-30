import mysql from "mysql2/promise";

async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS idk`);
    await connection.query(`USE idk`);
    console.log("Database ensured.");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        path VARCHAR(255) NOT NULL
      );
    `);
    console.log("Table ensured.");
  } catch (err) {
    console.error("Error ensuring database and table:", err);
  }

  return connection;
}

let db: mysql.Connection;
initializeDatabase().then((connection) => {
  db = connection;
  console.log("Connected to database.");
});
export { db };
