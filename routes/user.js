const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

//Rutas
router.get("/prueba-user", UserController.pruebaUser);
router.post("/register", UserController.register);


//esportar router para ser usado en la app
module.exports = router;
