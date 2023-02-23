const express = require("express");
const router = express.Router();
const FollowController = require("../controllers/follow");

//Rutas
router.get("/prueba-follow", FollowController.pruebaFollow);


//esportar router para ser usado en la app
module.exports = router;
