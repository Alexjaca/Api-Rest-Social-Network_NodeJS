//IMPORTANDO MODELOS
const Follow = require("../models/follow");
const User = require("../models/user");

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

  //sacar id del ususario identificado
  const identity = req.user;

  //crear el objeto con modelo follow
  let userToFollow = new Follow({
    user: identity.id,
    followed: params.followed,
  });

  //guardar objeto en bbdd
  userToFollow.save((err, followStored) => {
    if (err || !followStored) {
      return res.status(200).json({
        status: "error",
        message: "No se ha podido seguir al ususario"
      });
    }

    return res.status(200).json({
      status: "success",
      identity: req.user,
      follow: followStored
    });
  });
};

//Accion de borrar un follow (accion dejr de seguir)///////////////////////////////////////
const unfollow = (req, res) =>{

    //recoger el ide del ususario identificado
    const userId = req.user.id;

    //recoger el id del usuario que sigo y quiero dejar de seguir
    const followedId = req.params.id;

    //Find de las coincidencias y hacer remove
    Follow.find({
        "user": userId,
        "followed": followedId
    }).remove((err, followedDeleted) =>{

        if(err || !followedDeleted){

            return res.status(500).json({
                status: "error",
                message: "No has dejado de seguir a nadie"
              });
        }

        return res.status(200).json({
            status: "success",
            message: "Acabas de dejar de seguir al usuario"
          });

    }); 
}

//Acccion listado de usuarios que estoy siguiendo

//Accion listado de usuarios queme siguen

//exportar acciones
module.exports = {
  pruebaFollow,
  save,
  unfollow
};
