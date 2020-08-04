// LkHIYaMzwSils7oz
const express = require('express');
const bodyParser = require("body-parser");

const Post = require("./models/post");

const app = express();

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
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
})

//adding POST
app.post("/api/posts", (req, res, next) => {
  // const post = req.body;
  const post = Post({
    title: req.body.title,
    content: req.body.content
  })
  console.log(post);
  //201 means everything is ok also added one new resource
  res.status(201).json({
    message: 'Post added successfully'
  })
})

app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "asdfjasdf",
      title: "First server-side post",
      content: "This is coming from the server"
    },
    {
      id: "n;lka;j",
      title: "Second server-side post",
      content: "This is coming from the server"
    }
  ];
  res.status(200).json({
    message: 'Posts fetched successfully!',
    posts: posts
  });
});

module.exports = app;
