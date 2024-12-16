const express = require("express");
const router = express.Router();
const extractJWT = require("../middlewares/extractJWT");
const reservationController = require("../controllers/reservation");

router.get("/:storeId/occupied/:serviceId", reservationController.occupiedDays);
router.post("/", reservationController.create);

module.exports = router;
