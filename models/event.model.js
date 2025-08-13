const fs = require("fs").promises;
const path = require("path");

const databasePath = path.join(__dirname, "..", "database.json");

const createEvent = async (newEvent) => {
  try {
    const data = await fs.readFile(databasePath, "utf-8");
    const database = JSON.parse(data);
    database.events.push(newEvent);
    const updatedData = JSON.stringify(database, null, 2);
    await fs.writeFile(databasePath, updatedData, "utf-8");

    console.log("New event successfully added to the database.");
    return newEvent;
  } catch (error) {
    console.error("Error writing to the database:", error);
    throw new Error("Failed to create event.");
  }
};

const createUser = async (newUser) => {
  try {
    const data = await fs.readFile(databasePath, "utf-8");
    const database = JSON.parse(data);
    database.users.push(newUser);
    const updatedData = JSON.stringify(database, null, 2);
    await fs.writeFile(databasePath, updatedData, "utf-8");
    return newUser;
  } catch (err) {
    console.error("Error writing to the database:", err);
    throw new Error("Failed to register");
  }
};

const findUser = async (userData) => {
    const email = userData.email
    const data = await fs.readFile(databasePath, "utf-8");
    const database = JSON.parse(data);
    const user = database.users.find((user) => user.email == email)
    return user
}

module.exports = {
  createEvent,
  createUser,
  findUser
};
 