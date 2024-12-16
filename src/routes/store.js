const express = require("express");
const router = express.Router();
const extractJWT = require("../middlewares/extractJWT");
const storeController = require("../controllers/store");

router.get("/:cityId", storeController.getStoreByCityId);
router.get("/:storeId/services", storeController.getServicesByStoreId);
router.get("/", storeController.getAllStores);
router.put("/", storeController.updateServiceStatus);

module.exports = router;
