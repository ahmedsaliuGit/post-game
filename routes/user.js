const express = require("express");

const router = express.Router();

const {
  userById,
  allUser,
  getUser,
  updateUser,
  deleteUser
} = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");

router.get("/users", allUser);
router.get("/user/:userId", requireSignin, getUser);
router.put("/user/:userId", requireSignin, updateUser);
router.delete("/user/:userId", requireSignin, deleteUser);

// any route containing :userId param will execute userById()
router.param("userId", userById);

module.exports = router;
