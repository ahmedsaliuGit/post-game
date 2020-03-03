const express = require("express");

const router = express.Router();

const { createPostValidator } = require("../validator");

const { userById } = require("../controllers/user");
const { getPosts, createPost } = require("../controllers/post");
const { requireSignin } = require("../controllers/auth");

router.get("/posts", getPosts);
router.post("/post/create", requireSignin, createPostValidator, createPost);

// any route containing :userId param will execute userById()
router.param("userId", userById);

module.exports = router;
