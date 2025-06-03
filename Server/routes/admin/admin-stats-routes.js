const express = require("express");
const { getAdminStats } = require("../../controllers/admin/admin-stats-controller");
const router = express.Router();

router.get("/", getAdminStats);

module.exports = router;