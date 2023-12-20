const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainCtrl");
/* router start */
router.get('/', mainController.homepage)
router.get('/about', mainController.about)
/* router end */
module.exports = router;
