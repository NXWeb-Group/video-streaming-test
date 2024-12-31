import mysql from "mysql2/promise";

async function ensure() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`idk\``);
    await connection.query(`USE \`idk\``);
    console.log("Database ensured.");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        hashed_password VARCHAR(255) NOT NULL
      );
    `);
    console.log("Table 'accounts' ensured.");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        media JSON,
        FOREIGN KEY (userId) REFERENCES accounts(id)
      );
    `);
    console.log("Table 'posts' ensured.");
  } catch (err) {
    console.error("Error ensuring database and table:", err);
  } finally {
    if (connection) connection.end();
  }
}

await ensure();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "idk",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
