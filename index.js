// app.js
const express = require("express");
const app = express();
const port = 3005;
const userRouter = require("./users");
const { logger, authenticate } = require("./middlewares/logger");

app.use(express.json());
app.use(logger);

// Use the users router for all /users routes
app.use("/users", userRouter);

// Protected route example
app.get("/protected", authenticate, (req, res) => {
  res.json({ message: "Access allowed" });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Server error");
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
