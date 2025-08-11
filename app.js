const express = require("express")


const app = express()

app.listen(3000, (err) => {
    if (err) {
    return console.log('Something bad happened', err);
  }
  console.log(`Server is listening on ${3000}`);
})
module.exports = app;