	const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");
const app = express();
const port = 8081;
let lastRowId = 0; 
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
function getDbSize() {
    return fs.statSync("data.db").size;
}
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
// API to save data
app.post("/api/save-data", (req, res) => {
  const { time, charge_power, discharge_power } = req.body;

  const query =
    "INSERT INTO power_data (time, charge_power, discharge_power) VALUES (?, ?, ?)";
  db.run(query, [time, charge_power, discharge_power], function (err) {
    if (err) {
      console.error("Error saving data:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    res
      .status(200)
      .json({ message: "Data saved successfully", id: this.lastID });
  });
});

// Endpoint to fetch data
app.get("/api/get-data", (req, res) => {
  db.all(`SELECT * FROM power_data`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});
// API to save battery data
app.post("/api/save-batterydata", (req, res) => {
  const {
  	time,
    Battery_rack_current,
    Battery_rack_voltage,
    Battery_rack_Charge_power,
    Battery_rack_DisCharge_power,
    Total_Battery_Charge_Energy_of_life_cycle,
    Total_Battery_Discharge_Energy_of_life_cycle,
    Lowest_cell_voltage,
    Highest_cell_voltage,
    Min_cell_temperature,
    Max_cell_temperature,
    ID_of_lowest_cell_voltage,
    ID_of_highest_cell_voltage,
    ID_of_min_cell_temperature,
    ID_of_max_cell_temperature,
    SoC_of_rack,
    SoH_of_rack,
    DC_insulation_resistance
  } = req.body.batteryData;

  if (!Battery_rack_current || !Battery_rack_voltage) {
    return res.status(400).json({ message: "Invalid data" });
  }

  db.run(`
    INSERT INTO battery_data (
      time,
      Battery_rack_current,
      Battery_rack_voltage,
      Battery_rack_Charge_power,
      Battery_rack_DisCharge_power,
      Total_Battery_Charge_Energy_of_life_cycle,
      Total_Battery_Discharge_Energy_of_life_cycle,
      Lowest_cell_voltage,
      Highest_cell_voltage,
      Min_cell_temperature,
      Max_cell_temperature,
      ID_of_lowest_cell_voltage,
      ID_of_highest_cell_voltage,
      ID_of_min_cell_temperature,
      ID_of_max_cell_temperature,
      SoC_of_rack,
      SoH_of_rack,
      DC_insulation_resistance
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    time,
    Battery_rack_current,
    Battery_rack_voltage,
    Battery_rack_Charge_power,
    Battery_rack_DisCharge_power,
    Total_Battery_Charge_Energy_of_life_cycle,
    Total_Battery_Discharge_Energy_of_life_cycle,
    Lowest_cell_voltage,
    Highest_cell_voltage,
    Min_cell_temperature,
    Max_cell_temperature,
    ID_of_lowest_cell_voltage,
    ID_of_highest_cell_voltage,
    ID_of_min_cell_temperature,
    ID_of_max_cell_temperature,
    SoC_of_rack,
    SoH_of_rack,
    DC_insulation_resistance
  ], (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: "Failed to save data" });
    }

    res.status(200).json({ message: "Data saved successfully" });
  });
});
function fetchChangedData(callback) {
  db.all(
    `SELECT * FROM battery_data WHERE id > ?`, 
    lastRowId,
    (err, rows) => {
      if (err) {
        console.error(err);
        callback([]);
        return;
      }

      if (rows.length > 0) {
        lastRowId = rows[rows.length - 1].id; 
      }


      callback(rows);
    }
  );
}
// Endpoint to fetch battery data
app.get("/api/get-batterydata", (req, res) => {
  db.all(`SELECT * FROM battery_data`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);

  });
});
// Endpoint to fetch changed battery data
app.get('/api/get-changed-batterydata', (req, res) => {

  fetchChangedData((data) => {
    res.json(data);
    
  });
});
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
process.on('SIGINT', () => {
  db.close();
  process.exit();
});
