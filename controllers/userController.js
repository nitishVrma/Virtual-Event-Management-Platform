const bcrypt = require("bcrypt");
require("dotenv").config();
const rounds = 5;
const { createUser, findUser } = require("../models/event.model");

const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    userData.password = await bcrypt.hash(userData.password, rounds);
    const createdUser = await createUser(userData);
    res
      .status(201)
      .json({ message: "User created successfully", user: createdUser });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong: " + err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = req.body;
    const dbUser = await findUser(userData);
    if (!dbUser) {
      res.status(404).json({ message: "user Not found" });
    }
    const isSamePass = await bcrypt.compare(user.password, dbUser.password);
    if (!isSamePass) {
      throw new Error("Invalid Password");
    }
    const payload = {
      id: dbUser.id,
      email: dbUser.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    return { status: "ok", token: token, user: { id: dbUser.id } };
  } catch (err) {
    res.status(500).send({ error: "Something went wrong: " + err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
