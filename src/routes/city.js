const express = require("express");
const router = express.Router();
const extractJWT = require("../middlewares/extractJWT");
const cityController = require("../controllers/city");

router.get("/:name", cityController.getCityByName);

module.exports = router;
