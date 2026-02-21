const express = require("express");
const jwt = require("jsonwebtoken");
const { 
  registerUser,
  loginUser,
  getEvents,
  postEvent,
  putEvent,
  deleteEventById,
  registerForEvent
} = require("../controllers/userController");

const router = express.Router();

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Authentication failed. Invalid token." });
  }
};

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/events", getEvents);
router.post("/events", auth, postEvent);
router.put("/events/:id", auth, putEvent);
router.delete("/events/:id", auth, deleteEventById);

router.post("/events/:id/register", auth, registerForEvent);

module.exports = router;
