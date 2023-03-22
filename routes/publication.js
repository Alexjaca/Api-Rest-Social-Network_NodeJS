const express = require("express");
const router = express.Router();
const PublicationController = require("../controllers/publication");
const authorization = require("../middlewares/auth");
const multer = require("multer");


//configuracion de subida
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./uploads/publications"); //destino de iimagenes
    },
    filename: (req, file, cb) =>{
        cb(null, "pub-"+Date.now()+"-"+file.originalname); //nombre de las imageens
    }
});

const uploads = multer({storage}); // se guarda la configuracion en una constante

//Rutas
router.get("/prueba-publication", PublicationController.pruebaPublication);
router.post("/save", authorization.auth, PublicationController.save);
router.get("/detail/:id", authorization.auth, PublicationController.detail);
router.delete("/remove/:id", authorization.auth, PublicationController.remove);
router.get("/user/:id/:page?", authorization.auth, PublicationController.user);
router.post("/upload/:id", [authorization.auth, uploads.single("file0")], PublicationController.upload);
router.get("/media/:file", PublicationController.media);
router.get("/feed/:page?", authorization.auth, PublicationController.feed);


//esportar router para ser usado en la app
module.exports = router;
