const express = require("express");
const multer = require('multer');

const Post = require("../models/post");

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

//adding POST
router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
  // const post = req.body;
  const url = req.protocol + '://' + req.get('host');
  const post = Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  })

  // console.log(post);
  post.save().then(createdPost => {
    console.log(createdPost);
    //201 means everything is ok also added one new resource
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    });
  });
  /* will automatically create new collection which is
  the plural and lowercase of model (Post -> posts) */
});

router.put("/:id",
  multer({storage: storage}).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }

    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({ message: "Update successful!"});
  });
});

router.get("", (req, res, next) => {
  console.log(req.query);
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find() //this won't return anything unless we use .then
  let fetchedPosts;
  if(pageSize && currentPage){
    postQuery
      .skip(pageSize * (currentPage - 1)) //if pageSize = 10, currentPage 2, we skip 10 data
      .limit(pageSize);
  }
  //use Post (posts collection) to find all data in this collection
  postQuery
    .then( documents => {
      console.log(documents);
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count
    });})
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  })
})


router.delete("/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message: "Post deleted!"});
  })
})

module.exports = router;
