const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");
const app = express();
const port = 8081;

app.use(express.static(path.join(__dirname, "/")));

app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database("data.db", (err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");

    // Create table if it doesn't exist
    db.run(
      `CREATE TABLE IF NOT EXISTS data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          param1 INTEGER,
          param2 INTEGER,
          param3 INTEGER,
          param4 INTEGER,
          param5 INTEGER,
          param6 INTEGER
      )`,
      (err) => {
        if (err) {
          console.error("Error creating table:", err.message);
        }
      }
    );
  }
});

app.post("/submit", (req, res) => {
  const data = req.body.newData; // Get data from client
  const id = data.id; // Assume you have an ID to identify the record to update

  // Query the database to get the valid fields (columns) from the 'data' table
  db.all("PRAGMA table_info(data)", [], (err, rows) => {
    if (err) {
      console.error("Error retrieving table information:", err.message);
      return res
        .status(500)
        .json({ message: "Error retrieving table information", error: err });
    }

    // Extract column names from the result and filter out 'id'
    const allowedFields = rows
      .map((row) => row.name) // Get the 'name' property from each row (column name)
      .filter((col) => col !== "id"); // Exclude the 'id' column from allowed fields

    // Filter the incoming data based on allowed fields
    const fields = Object.keys(data).filter(
      (key) => key !== "id" && allowedFields.includes(key)
    ); // Only allow valid fields

    if (fields.length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }
    console.log(fields);
    const placeholders = fields.map((field) => `${field} = ?`).join(", "); // Create the SET clause for SQL
    const values = fields.map((field) => data[field]); // Get values for the fields

    // SQL statement to update data
    const sql = `UPDATE data SET ${placeholders} WHERE id = ?`;
    values.push(id); // Add ID to the list of values

    const stmt = db.prepare(sql);

    stmt.run(...values, function (err) {
      if (err) {
        console.error("Error updating data:", err.message);
        return res
          .status(500)
          .json({ message: "Error updating data", error: err });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: "No record found to update" });
      }

      res.status(200).json({ message: "Data updated successfully!" });
    });

    stmt.finalize(); // End the statement
  });
});

// Serve JSON data when requested
app.get("/get_oob_data.json", function (req, res) {
  try {
    let jsonFilePath = path.join(__dirname, "public", "oob_data.json");
    let json_file = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

    res.json(json_file); // Send the JSON data to the client
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Could not read JSON file" });
  }
});
// Endpoint to get users from the database
app.get("/get_users", function (req, res) {
  const sql = `SELECT * FROM users`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Could not fetch data from the database",
      });
    }

    // Send the database records as JSON
    res.json(rows);
  });
});
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
