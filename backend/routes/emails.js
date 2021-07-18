const express = require("express");
const path = require("path");

const EmailsController = require("../controllers/emails");

const router = express();

router.post("/requestPayment", EmailsController.requestPayment);

router.post("/sendConfirmation", EmailsController.sendConfirmation);

module.exports = router;
