
const router = require("express").Router();
const Post = require("../models/Posts");
const User = require('../models/User');

// Create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
     
  } catch (err) {
    res.status(500).json(err);
  }
});



// Update Post


router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
     if (post.userId === req.body.userId) {
      
      await post.updateOne({ $set: req.body });
      res.status(200).json("your post has been updated");
    } else {

      res.status(403).json("you are only permitted to update your own posts");
    }
  } catch (err) {
     res.status(500).json(err);
  }
});

// Delete post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
     if (post.userId === req.body.userId) {
       await post.deleteOne();
       res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// Like post

router.put("/:id/like", async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);
    if (post.likes.filter((item)=> item.userId === req.body.userId).length === 0) {
      //const item = await post.updateOne({$push: { likes: req.body.userId } });
      post.likes.push({userId: req.body.userId});
      const item2 = await post.save();

      res.status(200).json("The post has been liked");
    } else {

      //await post.updateOne({$pull: { likes: req.body.userId } });
      post.likes = post.likes.filter((item)=> item.userId !== req.body.userId);
      post.save()
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// Get a post
router.get("/:id", async (req, res) => {
  try {
     const post = await Post.findById(req.params.id);
  res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);

  }
});

//get timeline posts

router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});


// get all userfollers timelines









module.exports = router;
