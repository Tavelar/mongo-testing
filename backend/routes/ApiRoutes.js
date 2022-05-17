const express = require("express");
const router = express.Router();
const endPoint = require("../../endpoints.json");
router.get("/", (req, res) => {
  res.status(200).send(endPoint);
});

module.exports = router;
