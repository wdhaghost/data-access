require('dotenv').config({ path: '../.env' });

// index.js
const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const connection = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "password",
  database: process.env.MYSQL_DATABASE || "events_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function execute(sql, params = []) {
  const [rows] = await connection.query(sql, params);
  return rows;
}

/* Routes pour les événements */

app.get("/events", async (_req, res) => {
  try {
    const events = await execute("SELECT * FROM event ORDER BY start_date DESC");
    res.json(events);
  } catch (err) {
    console.error("GET /events error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/events/:id", async (req, res) => {
  const eventId = parseInt(req.params.id, 10);

  if (!Number.isInteger(eventId)) {
    return res.status(400).json({ error: "event id invalide" });
  }

  try {
    const rows = await execute("SELECT * FROM event WHERE id = ?", [eventId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Évènement introuvable" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("GET /events/:id error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/events", async (req, res) => {
  const { name, start_date, end_date, location, max_attendees } = req.body;

  if (!name || !start_date || !end_date || !location || !max_attendees) {
    return res.status(400).json({
      error: "name, start_date, end_date, location, max_attendees requis",
    });
  }

  try {
    await execute("CALL create_events(?, ?, ?, ?, ?)", [
      name,
      start_date,
      end_date,
      location,
      max_attendees,
    ]);

    res.status(201).json({ message: "Évènement créé" });
  } catch (err) {
    console.error("POST /events error:", err);

    if (err.errno === 1644) {
      // SIGNAL 45000 dans la procédure (dates invalides, doublon logique, etc.)
      return res.status(400).json({ error: err.sqlMessage });
    }

    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ error: "Un évènement avec ces informations existe déjà" });
    }

    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.delete("/events/:id", async (req, res) => {
  const eventId = parseInt(req.params.id, 10);

  if (!Number.isInteger(eventId)) {
    return res.status(400).json({ error: "event id invalide" });
  }

  try {
    await execute("CALL delete_event(?)", [eventId]);
    res.json({ message: "Évènement supprimé" });
  } catch (err) {
    console.error("DELETE /events/:id error:", err);

    if (err.errno === 1644) {
      // SIGNAL 45000 dans delete_event (évènement introuvable)
      return res.status(400).json({ error: err.sqlMessage });
    }

    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        error:
          "Impossible de supprimer l’évènement : des inscriptions existent encore ou contrainte de clé étrangère.",
      });
    }

    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.put("/events/:id/dates", async (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  const { start_date, end_date } = req.body;

  if (!Number.isInteger(eventId)) {
    return res.status(400).json({ error: "event id invalide" });
  }

  if (!start_date || !end_date) {
    return res.status(400).json({ error: "start_date et end_date requis" });
  }

  try {
    await execute("CALL update_date(?, ?, ?)", [
      eventId,
      start_date,
      end_date,
    ]);

    res.json({ message: "Dates mises à jour" });
  } catch (err) {
    console.error("PUT /events/:id/dates error:", err);

    if (err.errno === 1644) {
      // dates invalides ou évènement introuvable
      return res.status(400).json({ error: err.sqlMessage });
    }

    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* Routes pour les participants */

app.get("/events/:id/attendees", async (req, res) => {
  const eventId = parseInt(req.params.id, 10);

  if (!Number.isInteger(eventId)) {
    return res.status(400).json({ error: "event id invalide" });
  }

  try {
    const attendees = await execute(
      "SELECT * FROM attendee WHERE event_id = ?",
      [eventId]
    );

    res.json(attendees);
  } catch (err) {
    console.error("GET /events/:id/attendees error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/events/:id/attendees", async (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  const { first_name, last_name } = req.body;

  if (!Number.isInteger(eventId)) {
    return res.status(400).json({ error: "event id invalide" });
  }

  if (!first_name || !last_name) {
    return res.status(400).json({ error: "first_name et last_name requis" });
  }

  try {
    const rows = await execute("CALL create_attendee(?, ?, ?)", [
      eventId,
      first_name,
      last_name,
    ]);

    let message = "Inscription réussie";
    if (Array.isArray(rows) && rows[0] && rows[0][0] && rows[0][0].message) {
      message = rows[0][0].message;
    }

    res.json({ message });
  } catch (err) {
    console.error("POST /events/:id/attendees error:", err);

    if (err.errno === 1644) {
      // SIGNAl dans la procédure (évènement plein, etc.)
      return res.status(400).json({ error: err.sqlMessage });
    }

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: "Le participant est déjà inscrit à cet évènement",
      });
    }

    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.delete("/events/:id/attendees", async (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  const { first_name, last_name } = req.body;

  if (!Number.isInteger(eventId)) {
    return res.status(400).json({ error: "event id invalide" });
  }

  if (!first_name || !last_name) {
    return res.status(400).json({ error: "first_name et last_name requis" });
  }

  try {
    await execute("CALL delete_attendee(?, ?, ?)", [
      eventId,
      first_name,
      last_name,
    ]);

    res.json({ message: "Participant désinscrit" });
  } catch (err) {
    console.error("DELETE /events/:id/attendees error:", err);

    if (err.errno === 1644) {
      // participant non trouvé pour cet évènement
      return res.status(400).json({ error: err.sqlMessage });
    }

    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
