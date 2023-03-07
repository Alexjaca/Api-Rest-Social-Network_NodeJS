const express = require("express");
const router = express.Router();
const FollowController = require("../controllers/follow");
const authorization = require("../middlewares/auth");

//Rutas
router.get("/prueba-follow", FollowController.pruebaFollow);
router.post("/save", authorization.auth, FollowController.save);
router.delete("/unfollow/:id", authorization.auth, FollowController.unfollow);


//esportar router para ser usado en la app
module.exports = router;
