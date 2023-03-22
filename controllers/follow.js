//IMPORTANDO MODELOS
const Follow = require("../models/follow");
const User = require("../models/user");

//IMPORTAR DEPENDECIAS
const Paginate = require("mongoose-pagination");

//IMPORTAR SERVICIOS
const followService = require("../services/followService");

//acciones de prueba
const pruebaFollow = (req, res) => {
  return res.status(200).json({
    message: "Estamos en la Ruta del controlador pruebaFollow",
  });
};

//Accion de guardar un follow (accion de seguir)/////////////////////////////////////////////
const save = (req, res) => {
  //conseguir datos del body
  const params = req.body;
  const followedId = req.params.id;

  //sacar id del ususario identificado
  const identity = req.user;
  const userId = req.user.id;
  //crear el objeto con modelo follow
  let userToFollow = new Follow({
    user: identity.id,
    followed: params.followed,
  });

  //guardar objeto en bbdd////

  Follow.find(
    {
      user: req.user.id,
      followed: params.followed,
    },
    (err, findFollowed) => {
      if (err || !findFollowed || findFollowed == '') {

        userToFollow.save((err, followStored) => {
          if (err || !followStored) {
            return res.status(400).json({
              status: "error",
              message: "No se ha podido seguir al ususario",
            });
          }

          return res.status(200).json({
            status: "success",
            identity: req.user,
            follow: followStored,
          });
        });
      } else {
        return res.status(400).json({
          status: "error",
          message: "Ya sigues a este usuario no puedes volver a seguirlo"
        });
      }
    }
  );
};


//Accion de borrar un follow (accion dejr de seguir)///////////////////////////////////////
const unfollow = (req, res) => {
  //recoger el ide del ususario identificado
  const userId = req.user.id;

  //recoger el id del usuario que sigo y quiero dejar de seguir
  const followedId = req.params.id;

  //Find de las coincidencias y hacer remove
  Follow.find({
    user: userId,
    followed: followedId,
  }).remove((err, followedDeleted) => {
      if (err || !followedDeleted) {
        return res.status(500).json({
          status: "error",
          message: "No has dejado de seguir a nadie",
        });
    }

    return res.status(200).json({
      status: "success",
      message: "Acabas de dejar de seguir al usuario",
    });
  });
};

//Acccion listado que cualquier usuarios esta siguiendo (SIGUIENDO)/////////////////////
const following = (req, res) => {
  //Sacar el id del ususario identificado
  let userId = req.user.id;

  // Comprobar si me llega el id por parametro en la url
  if (req.params.id) userId = req.params.id;

  //Comprobar si llega la pagina o no
  let page = 1;

  if (req.params.page) page = req.params.page;
  //Usuarios por pagina quiero mostrar
  const itemsPerPage = 3;

  // Find o follow, popular datos de los usuarios y paginar con moongoose

  Follow.find({ user: userId })
    //populate me trae el objeto completo del user y el followed, y me quita passw y role 
    .populate("user followed", "-password -role -__v -email")
    .paginate(page, itemsPerPage, async (err, follows, total) => {

      // Listado de usuarios como user, y yo soy alexander
      // Sacar un array de ids de los usuarios que me siguen y los que sigo como alex
      let followwUserIdes = await followService.followUserIds(req.user.id);

      return res.status(200).json({
        status: "success",
        message: "listado de usuarios que estoy siguiendo",
        follows,
        total,
        pages: Math.ceil(total / itemsPerPage),
        user_followings: followwUserIdes.following,
        user_follow_me: followwUserIdes.followers
      });
    });
}


//Accion listado de usuarios que siguen a cualquier otro usuario (SOY SEGUIDO, MIS SEGUIDORES)////////////
const followers = (req, res) => {

  //Sacar el id del ususario identificado
  let userId = req.user.id;

  // Comprobar si me llega el id por parametro en la url
  if (req.params.id) userId = req.params.id;

  //Comprobar si llega la pagina o no
  let page = 1;

  if (req.params.page) page = req.params.page;
  //Usuarios por pagina quiero mostrar
  const itemsPerPage = 3;
  
  Follow.find({ followed: userId })
    //populate me trae el objeto completo del user y el followed, y me quita passw y role 
    .populate("user", "-password -role -__v -email")
    .paginate(page, itemsPerPage, async (err, follows, total) => {


      let followwUserIdes = await followService.followUserIds(req.user.id);

      return res.status(200).json({
        status: "success",
        message: "listado de usuarios que me siguen",
        follows,
        total,
        pages: Math.ceil(total / itemsPerPage),
        user_followings: followwUserIdes.following,
        user_follow_me: followwUserIdes.followers
      });
    });
}

//exportar acciones
module.exports = {
  pruebaFollow,
  save,
  unfollow,
  following,
  followers
};
