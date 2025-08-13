const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { 
  createUser,
  findUserByEmail,
  findAllEvents,
  createEvent,
  findEventById,
  updateEvent,
  deleteEvent,
  registerAttendee
} = require("../models/event.model");
const { sendEmail } = require("../utils/emailService");

const rounds = 5;

const registerUser = async (req, res) => {
  try {
    const user = req.body;
    if (!user.email || !user.password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    const existingUser = await findUserByEmail(user.email);
    if (existingUser) {
        return res.status(409).json({ message: "This email is already in use." });
    }

    user.password = await bcrypt.hash(user.password, rounds);
    const newUser = await createUser(user);
    
    const emailBody = `<h1>Welcome, ${newUser.email}!</h1><p>Thank you for registering.</p>`;
    await sendEmail(newUser.email, "Welcome to Our App!", emailBody);

    res.status(201).json({ message: "Welcome!", user: { id: newUser.id, email: newUser.email, role: newUser.role } });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Couldn't register the user. Please try again." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userInDb = await findUserByEmail(email);

    if (!userInDb) {
      return res.status(404).json({ message: "User not found." });
    }

    const isSamePass = await bcrypt.compare(password, userInDb.password);
    if (!isSamePass) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const payload = { id: userInDb.id, email: userInDb.email, role: userInDb.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "2h" });

    res.status(200).json({ status: "ok", token, user: { id: userInDb.id, email: userInDb.email, role: userInDb.role } });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong during login." });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await findAllEvents();
    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to retrieve events." });
  }
};

const postEvent = async (req, res) => {
  try {
    const newEvent = req.body;
    const createdEvent = await createEvent(newEvent);
    res.status(201).json({ message: "Event created!", event: createdEvent });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to create event." });
  }
};

const putEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEventData = req.body;
    const updatedEvent = await updateEvent(id, updatedEventData);

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found." });
    }
    
    res.status(200).json({ message: "Event updated!", event: updatedEvent });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to update event." });
  }
};

const deleteEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteEvent(id);

    if (!deleted) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json({ message: "Event deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to delete event." });
  }
};

const registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
        return res.status(400).json({ message: "User ID is missing." });
    }

    const event = await registerAttendee(id, userId);

    if (!event) {
        return res.status(404).json({ message: "Event not found." });
    }
    
    res.status(200).json({ message: "You're registered for the event!", event });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to register for the event." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getEvents,
  postEvent,
  putEvent,
  deleteEventById,
  registerForEvent
};
