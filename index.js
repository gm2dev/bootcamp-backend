const express = require('express');
const app = express();
const port = 3005;

app.use(express.json());

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

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
app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  res.json(user);
});

// POST Add User
app.post('/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email,
  };

  users.push(newUser);
  res.status(201).json(newUser);

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
