const express = require("express");
const router = express.Router();
const extractJWT = require("../middlewares/extractJWT");
const userController = require("../controllers/users");

router.get("/:userId/services", userController.getServicesByUserId);

module.exports = router;
