const express = require("express");
const router = express.Router();
const PublicationController = require("../controllers/publication");
const authorization = require("../middlewares/auth");

//Rutas
router.get("/prueba-publication", PublicationController.pruebaPublication);
router.post("/save", authorization.auth, PublicationController.save);
router.get("/detail/:id", authorization.auth, PublicationController.detail);
router.delete("/remove/:id", authorization.auth, PublicationController.remove);
router.get("/user/:id/:page?", authorization.auth, PublicationController.user);


//esportar router para ser usado en la app
module.exports = router;
