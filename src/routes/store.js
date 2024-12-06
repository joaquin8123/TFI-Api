const express = require("express");
const router = express.Router();
const extractJWT = require("../middlewares/extractJWT");
const storeController = require("../controllers/store");

router.get("/:cityId", storeController.getStoreByCityId);
router.get("/", storeController.getAllStores);
//router.post("/", extractJWT, orderController.createOrder);
//router.put("/", extractJWT, orderController.updateOrder);

module.exports = router;
