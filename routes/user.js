const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const authorization = require("../middlewares/auth");

//Rutas
router.get("/prueba-user", authorization.auth, UserController.pruebaUser);
router.post("/register", UserController.register);
router.post("/login/:user?/:password?", UserController.login);


//esportar router para ser usado en la app
module.exports = router;
