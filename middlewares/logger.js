export const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

export const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token === "Bearer token123") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized" });
  }
};

export const validateUser = (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    next();
  } else {
    res.status(400).json({ message: "There are not all data" });
  }
};