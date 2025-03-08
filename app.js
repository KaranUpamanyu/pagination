const express = require("express");

const app = express();

const mongoose = require("mongoose");
const User = require("./users");
mongoose.connect("mongodb://localhost/pagination");
const db = mongoose.connection;

db.once("open", async () => {
  if ((await User.countDocuments().exec()) > 0) {
    return;
  }

  // Add users if there are none
  Promise.all([
    User.create({ name: "John" }),
    User.create({ name: "Doe" }),
    User.create({ name: "Karan" }),
    User.create({ name: "Test" }),
    User.create({ name: "Tom" }),
    User.create({ name: "Jerry" }),
    User.create({ name: "Mickey" }),
    User.create({ name: "Minnie" }),
    User.create({ name: "Donald" }),
    User.create({ name: "Daisy" }),
  ]).then(() => console.log("added some users"));
});

const paginateResults = (model) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (page > 1) {
      results.prev = {
        page: page - 1,
        limit: limit,
      };
    }

    try {
      results.results = await model.find().limit(limit).skip(startIndex);
      res.paginatedResults = results;
      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
};

app.get("/users", paginateResults(User), (req, res) => {
  res.send(res.paginatedResults);
});

app.listen(3000, (error) => {
  if (error) {
    console.log("Error running the server");
  }
  console.log("Server is running on port", 3000);
});
