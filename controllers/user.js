//importar dependencias y modulos
const bcrypt = require("bcrypt"); //encriptacion
const MongoosePagination = require("mongoose-pagination");
const fs = require("fs");
const path = require("path");

//importar servicios
const jwt = require("../services/jwt");
const followService = require("../services/followService");
const validate = require("../helpers/validate");


//Importar Modelos
const User = require("../models/user");
const Follow = require("../models/follow");
const Publication = require("../models/publication");




//acciones de prueba///////////////////////////////////////////////////////////////////
const pruebaUser = (req, res) => {
  return res.status(200).json({
    message: "Estamos en la Ruta del controlador pruebaUser",
    usuario: req.user,
  });
};

//Registro de usuarios///////////////////////////////////////////////////////////////////
const register = (req, res) => {
  //recoger datos de la peticion
  let params = req.body;

  //comprobar que me llegan bien los datos (Validacion)
  if (!params.name || !params.nick || !params.password || !params.email) {
    return res.status(404).json({
      status: "Error",
      message: "Validacion Incorrecta debe ingresar los datos del usuario",
    });
  }

  //Validacion avanzada
  try {
    validate(params);
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: "Validacion no Superada",
    });
  }
  

  //control de usuarios duplicados
  User.find({
    $or: [
      { email: params.email.toLowerCase() }, //Validando que no exista otro email en la bd igual
      { nick: params.nick.toLowerCase() }, //Validando que no exista otro nick en la bd igual
    ],
  }).exec(async (error, users) => {
    if (error)
      return res.status(500).json({
        status: "Error",
        message: "Error en la consulta de la BD",
      });

    if (users && users.length >= 1) {
      return res.status(200).send({
        status: "Success",
        message: "El usuario ya existe",
      });
    }

    //Cifrar la contraseña
    let passw = await bcrypt.hash(params.password, 10);
    params.password = passw;

    //crear objeto usuario
    let newUser = new User(params);

    //Guardar usuario en la bd
    newUser.save((err, userStored) => {
      if (err || !userStored) {
        return res.status(500).send({
          status: "Error",
          message: "Error al guardar el usuario en la bd",
        });
      }
      return res.status(500).send({
        status: "Success",
        message: "Usuario registrado correctamente",
        user: userStored,
      });
    });
  });
};

//Login de usuarios///////////////////////////////////////////////////////////////////
const login = (req, res) => {
  //Recoger parametros del body
  let params = req.body;

  if (!params.email || !params.password) {
    return res.status(500).send({
      status: "Error",
      message: "Faltan datos del ususario por enviar",
    });
  }

  //Buscar si el usuatrio existe en la bbdd
  User.findOne({ email: params.email })
    //.select({ "password": 0 }) //para que no me muestre el password
    .exec((err, user) => {
      if (err || !user) {
        return res.status(500).send({
          status: "Error",
          message: "El ususario no existe en la bbdd",
        });
      }

      //comprobar contraseña
      let pass = bcrypt.compareSync(params.password, user.password);

      if (!pass) {
        return res.status(500).send({
          status: "Error",
          message: "No te has identificado correctamente",
        });
      }

      //Devolver Token
      const token = jwt.createToken(user); //pasando el objeto para generar el token

      //Devolver datos de ususario
      return res.status(200).send({
        status: "Success",
        message: "Te has identificado correctamente",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          nick: user.nick,
        },
        token,
      });
    });
};

//Consultar Perfil///////////////////////////////////////////////////////////////////////////
const profile = (req, res) => {
  //Recibir el id del usuario por la url
  const id = req.params.id;

  //hacer consulta en la bd
  User.findById(id)
    .select({ password: 0, role: 0 })
    .exec(async (err, userProfile) => {
      if (err || !userProfile) {
        res.status(404).send({
          status: "error",
          message: "Error al buscar el perfil del ususario",
          err,
        });
      }

      //Info de Seguimiento
      const followInfo = await followService.followThisUser(req.user.id, id);

      //mostrar datos del ususario
      res.status(200).send({
        status: "success",
        user: userProfile,
        following: followInfo.following,
        follower: followInfo.follower,
      });
    });
};

//Lista de usuarios/////////////////////////////////////////////////////////////////////////////
const list = (req, res) => {
  //controlar la pagina donde estamos
  let page = 1;
  if (req.params.page) {
    page = req.params.page;
  }
  page = parseInt(page);

  //consulta con mongoose paginate
  let itemsPerPage = 3;

  User.find()
  .select("-password -email -role -__v")
    .sort("_id")
    .paginate(page, itemsPerPage, async(err, users, total) => {
      if (err || !users) {
        res.status(404).send({
          status: "error",
          message: "No se encontro ningun usuario en la consulta",
        });
      }

       // Sacar un array de ids de los usuarios que me siguen y los que sigo como alex
       let followwUserIdes = await followService.followUserIds(req.user.id);

      //Devolver resultado
      res.status(200).send({
        status: "success",
        users,
        page,
        itemsPerPage,
        total,
        pages: Math.ceil(total / itemsPerPage),
        user_followings: followwUserIdes.following,
        user_follow_me: followwUserIdes.followers
      });
    });
};

//Update usuarios/////////////////////////////////////////////////////////////////////////////
const update = (req, res) => {
  // Recoger info del ususario a actualizar
  let userIdentity = req.user; //sacando informacion de usuario del token
  let userToUpdate = req.body;

  //Eliminar campos sobranbtes
  delete userToUpdate.iat;
  delete userToUpdate.exp;
  delete userToUpdate.role;
  delete userToUpdate.image;

  // comprobar si el usuario ya existe
  User.find({
    $or: [
      { email: userToUpdate.email.toLowerCase() }, //Validando que no exista otro email en la bd igual
      { nick: userToUpdate.nick.toLowerCase() }, //Validando que no exista otro nick en la bd igual
    ],
  }).exec(async (error, users) => {
    if (error)
      return res.status(500).json({
        status: "Error",
        message: "Error en la consulta de la BD",
      });

    let userIsset = false;
    users.forEach((user) => {
      if (user && user._id != userIdentity.id) {
        console.log("true");
        userIsset = true;
      }
    });

    if (userIsset) {
      return res.status(200).send({
        status: "Success",
        message: "El usuario ya existe",
      });
    }

    //si me llega pasword cifrarla
    if (userToUpdate.password) {
      let passw = await bcrypt.hash(userToUpdate.password, 10);
      userToUpdate.password = passw;
    }else{
      delete userToUpdate.password;
    }

    // buscar y actualizar///////////////////////////////////////

    // User.findByIdAndUpdate(userIdentity.id, userToUpdate, { new: true },(err, userUpdated) => {
    //     if (err || !userUpdated) {
    //       return res.status(500).json({
    //         status: "Error",
    //         message: "Error al actualizar ususario"
    //       });
    //     }

    //     //Devolver resultado
    //     res.status(200).send({
    //       status: "success",
    //       message: "Metodo update del controlador",
    //       user: userUpdated
    //     });
    //   }
    // );

    //Otra forma de hacerlo con el await

    try {
      let userUpdated = await User.findByIdAndUpdate(
        {_id: userIdentity.id},
        userToUpdate,
        { new: true }
      );

      if (!userUpdated) {
        return res.status(500).json({
          status: "Error",
          message: "Error al actualizar ususario",
        });
      }

      //Devolver resultado
      res.status(200).send({
        status: "success",
        message: "Metodo update del controlador",
        user: userUpdated,
      });
    } catch (err) {
      return res.status(400).json({
        status: "Error",
        message: "Error al actualizar ususario",
        err, //No es recomendable mostrar detalles del error
      });
    }
  });
};

//Subida de imagenes/////////////////////////////////////////////////////////////////////////////
const upload = (req, res) => {
  //Recoger el fichero de imagen y comprobar que existe
  if (!req.file) {
    return res.status(404).json({
      status: "error",
      message: "Peticion no incluye la imagen",
    });
  }

  //Conseguir el nombre del archivo
  let image = req.file.originalname;

  //Sacar la extension del archivo
  const imageSplit = image.split(".");
  const extensionImage = imageSplit[1];

  //comprobar extension
  if (
    extensionImage != "jpg" &&
    extensionImage != "jpeg" &&
    extensionImage != "png" &&
    extensionImage != "gif"
  ) {
    //Borrar archivo subido
    const filePath = req.file.path;
    const filedELETED = fs.unlinkSync(filePath);

    //Devolver respuesta negativa
    return res.status(400).send({
      status: "error",
      message: "Extension del fichero invalida",
    });
  }

  //si es correcta guardar imagen en bbdd
  User.findOneAndUpdate(
    {_id:req.user.id},
    { image: req.file.filename },
    { new: true },
    (err, userUpdated) => {
      if (err || !userUpdated) {
        return res.status(400).send({
          status: "error",
          message: "Error en al subida del avatar",
        });
      }

      //devolver rrespuesta
      return res.status(200).send({
        status: "success",
        user: userUpdated,
        file: req.file,
      });
    }
  );
};

//Carga de imagenes/////////////////////////////////////////////////////////////////////////////
const avatar = (req, res) => {
  //sacar el parametro de la url
  const file = req.params.file;

  //Montar el path real de la imagen
  const filePath = "./uploads/avatars/" + file;

  //Comprobar que existe
  fs.stat(filePath, (err, exists) => {
    if (!exists || err) {
      return res.status(404).send({
        status: "error",
        message: "El archivo no existe"
      });
    }

    //Devolver un file
    return res.sendFile(path.resolve(filePath));

  });
};


//COUNTERSS//////////////////////////////////////////////////////////
const counters = async (req, res) =>{

  let userId = req.user.id;

  if(req.params.id){
    userId = req.params.id;
  }

  try {
    const following = await Follow.count({"user": userId});

    const followed = await Follow.count({"followed": userId});

    const publications = await Publication.count({"user": userId});

    return res.status(200).send({
      userId,
      following: following,
      followed: followed,
      publications: publications
    });
    
  } catch (error) {
    
    return res.status(404).send({
      status: "error",
      message: "Error en los contadores",
      error
    });
  }
}




//exportar acciones
module.exports = {
  pruebaUser,
  register,
  login,
  profile,
  list,
  update,
  upload,
  avatar,
  counters
};
