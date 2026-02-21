const express = require("express");
const routes = require("./routes/routes");

const app = express();
app.use(express.json());
app.use("/", routes);

app.listen(3000, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on 3000`);
});

module.exports = app;
