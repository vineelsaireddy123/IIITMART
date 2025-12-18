const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from cookies or Authorization header
  if (!token) {
    return res
      .status(403)
      .json({ message: "No token provided, access denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded._id; 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
module.exports = { verifyToken };