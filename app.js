const express = require("express");

const app = express();

const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Doe" },
  { id: 3, name: "Smith" },
  { id: 4, name: "Alex" },
  { id: 5, name: "Tom" },
  { id: 6, name: "Jerry" },
  { id: 7, name: "Mickey" },
  { id: 8, name: "Minnie" },
  { id: 9, name: "Donald" },
  { id: 10, name: "Daisy" },
];

app.get("/users", (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  res.send(users.slice(startIndex, endIndex));
});

app.listen(3000, (error) => {
  if (error) {
    console.log("Error running the server");
  }
  console.log("Server is running on port", 3000);
});
