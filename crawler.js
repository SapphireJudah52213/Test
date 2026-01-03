import fetch from "node-fetch";
import cheerio from "cheerio";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("search.db");

db.run(`
CREATE TABLE IF NOT EXISTS pages (
  url TEXT PRIMARY KEY,
  title TEXT,
  content TEXT
)`);

async function crawl(url) {
  console.log("Crawling:", url);

  const res = await fetch(url);
  const html = await res.text();

  const $ = cheerio.load(html);
  const title = $("title").text();
  const text = $("body").text().replace(/\s+/g, " ");

  db.run(
    "INSERT OR REPLACE INTO pages VALUES (?, ?, ?)",
    [url, title, text]
  );
}

// START SMALL (important)
crawl("https://example.com");
crawl("https://wikipedia.org");
