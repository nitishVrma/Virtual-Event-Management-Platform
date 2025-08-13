const fs = require("fs").promises;
const path = require("path");

const databasePath = path.join(__dirname, "..", "database.json");

const getDatabase = async () => {
  try {
    const data = await fs.readFile(databasePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading the database:", error);
    throw new Error("Failed to read the database file.");
  }
};

const saveDatabase = async (database) => {
  try {
    const updatedData = JSON.stringify(database, null, 2);
    await fs.writeFile(databasePath, updatedData, "utf-8");
  } catch (error) {
    console.error("Error writing to the database:", error);
    throw new Error("Failed to save the database file.");
  }
};

const findUserByEmail = async (email) => {
  const database = await getDatabase();
  return database.users.find((user) => user.email === email);
};

const createUser = async (newUser) => {
  const database = await getDatabase();
  newUser.id = database.users.length + 1;
  newUser.role = newUser.role || "attendee";
  database.users.push(newUser);
  await saveDatabase(database);
  return newUser;
};

const findAllEvents = async () => {
  const database = await getDatabase();
  return database.events;
};

const findEventById = async (eventId) => {
  const database = await getDatabase();
  return database.events.find((event) => event.id === parseInt(eventId));
};

const createEvent = async (newEvent) => {
  const database = await getDatabase();
  newEvent.id = database.events.length + 101;
  newEvent.attendees = [];
  database.events.push(newEvent);
  await saveDatabase(database);
  return newEvent;
};

const updateEvent = async (eventId, updatedEvent) => {
  const database = await getDatabase();
  const eventIndex = database.events.findIndex((event) => event.id === parseInt(eventId));

  if (eventIndex === -1) {
    return null;
  }

  database.events[eventIndex] = { ...database.events[eventIndex], ...updatedEvent };
  await saveDatabase(database);
  return database.events[eventIndex];
};

const deleteEvent = async (eventId) => {
  const database = await getDatabase();
  const initialLength = database.events.length;
  database.events = database.events.filter((event) => event.id !== parseInt(eventId));

  if (database.events.length === initialLength) {
    return false;
  }
  
  await saveDatabase(database);
  return true;
};

const registerAttendee = async (eventId, userId) => {
  const database = await getDatabase();
  const event = database.events.find((event) => event.id === parseInt(eventId));

  if (!event) {
    return null;
  }

  if (event.attendees.includes(userId)) {
    return event;
  }
  
  event.attendees.push(userId);
  await saveDatabase(database);
  return event;
};

module.exports = {
  findUserByEmail,
  createUser,
  findAllEvents,
  findEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerAttendee
};
