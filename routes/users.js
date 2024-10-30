// users.js
const express = require("express");
const router = express.Router();
const { authenticate, validateUser } = require("./middlewares/logger");

// Sample users data
let users = [
  { id: 1, name: "Juan", email: "juan@example.com" },
  { id: 2, name: "Maria", email: "maria@example.com" },
  { id: 3, name: "Ariana", email: "ariana@example.com" }
];

// GET Users
router.get("/", (req, res) => {
  res.json(users);
});

// GET User by Id
router.get("/:id", authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((user) => user.id === id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// POST Add User
router.post("/", validateUser, (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// PATCH User
router.patch("/:id", authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((user) => user.id === id);
  if (user) {
    if (!req.body.name || !req.body.email) {
      return res.status(400).json({ message: "All fields are required" });
    }
    user.name = req.body.name;
    user.email = req.body.email;
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// PUT Update User
router.put("/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[userIndex] = {
    id: userId,
    name: req.body.name,
    email: req.body.email,
  };

  res.json(users[userIndex]);
});

// DELETE User
router.delete("/:id", authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  users = users.filter((user) => user.id !== id);
  res.status(200).json({ message: `User ${id} deleted` });
});

module.exports = router;
