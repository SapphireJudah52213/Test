import express from "express";
import sqlite3 from "sqlite3";

const app = express();
const db = new sqlite3.Database("search.db");

app.get("/search", (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]);

  db.all(
    `SELECT url, title,
     LENGTH(content) - LENGTH(REPLACE(LOWER(content), LOWER(?), '')) AS score
     FROM pages
     WHERE content LIKE ?
     ORDER BY score DESC
     LIMIT 10`,
    [q, `%${q}%`],
    (err, rows) => res.json(rows)
  );
});

app.listen(3000, () =>
  console.log("Search engine running on http://localhost:3000")
);
