// users.js
import { authenticate, validateUser } from "../middlewares/logger.js";
import express from "express";
import db from "../database/sqlite.js"

const router = express.Router();

// GET Users
router.get("/", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET User by Id
router.get("/:id", authenticate, (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      res.status(200).json(row);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
});

// POST Add User
router.post("/", validateUser, (req, res) => {
  const { name, email } = req.body;
  db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, name, email });
  });
});

// PATCH User
router.patch("/:id", authenticate, (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;

  db.run(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes > 0) {
        res.status(200).json({ id, name, email });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    }
  );
});

// PUT Update User
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;

  db.run(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes > 0) {
        res.json({ id, name, email });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    }
  );
});

// DELETE User
router.delete("/:id", authenticate, (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM users WHERE id = ?", id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes > 0) {
      res.status(200).json({ message: `User ${id} deleted` });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
});

export default router;
