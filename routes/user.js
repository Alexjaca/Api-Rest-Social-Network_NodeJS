const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const authorization = require("../middlewares/auth");
const multer = require("multer");


//configuracion de subida
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./uploads/avatars"); //destino de iimagenes
    },
    filename: (req, file, cb) =>{
        cb(null, "avatar-"+Date.now()+"-"+file.originalname); //nombre de las imageens
    }
});

const uploads = multer({storage}); // se guarda la configuracion en una constante

//Rutas
router.get("/prueba-user", authorization.auth, UserController.pruebaUser);
router.post("/register", UserController.register);
router.post("/login/:user?/:password?", UserController.login);
router.get("/profile/:id", authorization.auth, UserController.profile);
router.get("/list/:page?", authorization.auth, UserController.list);
router.put("/update", authorization.auth, UserController.update);
router.post("/upload", [authorization.auth, uploads.single("file0")], UserController.upload); //trabajar con 2 midelwares
router.get("/avatar/:file", UserController.avatar);
router.get("/counters/:id", authorization.auth, UserController.counters);

//esportar router para ser usado en la app
module.exports = router;
