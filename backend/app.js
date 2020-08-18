// LkHIYaMzwSils7oz
const express = require('express');
const bodyParser = require("body-parser");


// const Post = require("./models/post");
const postsRoutes = require("./routes/posts");

const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb+srv://cshih685:LkHIYaMzwSils7oz@cluster0.f7prf.mongodb.net/angular-mean?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to database');
  })
  .catch(() => {
    console.log('Connection failed!');
  })

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

//adding setHeader
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
})

app.use("/api/posts", postsRoutes);

module.exports = app;
