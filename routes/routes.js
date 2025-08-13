const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");

router.get("/home", (req, res) => {
  console.log("in home");
  res.status(200).json("hello");
});

router.post("/register", registerUser);
router.post("/login", loginUser)

module.exports = router;
