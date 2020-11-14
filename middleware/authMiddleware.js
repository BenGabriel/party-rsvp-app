const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) return res.status(401).json({ msg: "unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not verified" });
  }
};

module.exports = auth;
