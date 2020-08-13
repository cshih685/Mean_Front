// LkHIYaMzwSils7oz
const express = require('express');
const bodyParser = require("body-parser");

const Post = require("./models/post");
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

//adding POST
app.post("/api/posts", (req, res, next) => {
  // const post = req.body;
  const post = Post({
    title: req.body.title,
    content: req.body.content
  })

  // console.log(post);
  post.save().then(createdPost => {
    console.log(createdPost);
    //201 means everything is ok also added one new resource
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  });
  /* will automatically create new collection which is
  the plural and lowercase of model (Post -> posts) */
});

app.put("/api/posts/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({ message: "Update successful!"});
  });
});

app.get("/api/posts", (req, res, next) => {
    // const posts = [
  //   {
  //     id: "asdfjasdf",
  //     title: "First server-side post",
  //     content: "This is coming from the server"
  //   },
  //   {
  //     id: "n;lka;j",
  //     title: "Second server-side post",
  //     content: "This is coming from the server"
  //   }
  // ];

  //use Post (posts collection) to find all data in this collection
  Post.find()
    .then( documents => {
      console.log(documents);
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: documents
      });
    })
});

app.delete("/api/posts/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message: "Post deleted!"});
  })
})


module.exports = app;
