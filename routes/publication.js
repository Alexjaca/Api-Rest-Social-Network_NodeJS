const express = require("express");
const router = express.Router();
const PublicationController = require("../controllers/publication");

//Rutas
router.get("/prueba-publication", PublicationController.pruebaPublication);


//esportar router para ser usado en la app
module.exports = router;
