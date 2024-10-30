import { logger, authenticate, validateUser } from "./middlewares/logger";

const express = require('express');
const app = express();
const port = 3005;

app.use(express.json());
app.use(logger);

let users = [
  {
    id: 1, name: "Juan", email: "juan@example.com",
  },
  {
    id: 2, name: "Maria", email: "maria@example.com",
  },
  {
    id: 3, name: "Ariana", email: "ariana@example.com"
  }
];

// GET Users
app.get('/users', (req, res) => {
  res.json(users);
})

// GET User by Id
app.get("/users/:id", authenticate, (req, res) => {
  const id = req.params.id;
  const user = users.find((user) => user.id === parseInt(id));
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// POST Add User
app.post("/users", validateUser, (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

//PATCH User
app.patch("/users/:id", authenticate, (req, res) => {
  const id = req.params.id;
  const user = users.find((user) => user.id === parseInt(id));
  if (user) {
    if (!req.body.name || !req.body.email) {
      res.status(400).json({ message: "You must to complete all" });
    }
    user.name = req.body.name;
    user.email = req.body.email;
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

//PUT Update User
app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  users[userIndex] = {
    id: userId,
    name: req.body.name,
    email: req.body.email
  };

  res.json(users[userIndex])
});

app.delete("/users/:id", authenticate, (req, res) => {
  const id = req.params.id;
  users = users.filter((user) => user.id !== parseInt(id));
  res.status(200).json({ message: `User ${id} deleted` });
});


app.get("/protected", authenticate, (req, res) => {
  res.json({ message: "Access allow" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Error in the server");
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});