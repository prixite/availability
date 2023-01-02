const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const {
  getUsers,
  getUser,
  setAvailability,
  createUser,
  loginUser,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", createUser);

router.post("/login", loginUser);

router.patch("/", setAvailability);

router.use(requireAuth);

router.get("/all", getUsers);

router.get("/:id", getUser);

module.exports = router;
