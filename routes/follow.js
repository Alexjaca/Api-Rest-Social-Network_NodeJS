const express = require("express");
const router = express.Router();
const FollowController = require("../controllers/follow");
const authorization = require("../middlewares/auth");

//Rutas
router.get("/prueba-follow", FollowController.pruebaFollow);
router.post("/save", authorization.auth, FollowController.save);
router.delete("/unfollow/:id", authorization.auth, FollowController.unfollow);
router.get("/following/:id?/:page?", authorization.auth, FollowController.following);
router.get("/followers/:id?/:page?", authorization.auth, FollowController.followers);


//esportar router para ser usado en la app
module.exports = router;
