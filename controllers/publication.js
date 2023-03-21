//Importar modulos
const fs = require("fs");
const path = require("path");

//Importar modelos
const Publication = require("../models/publication");

//acciones de prueba
const pruebaPublication = (req, res) => {
    return res.status(200).json({
        message: "Estamos en la Ruta del controlador pruebaPublication"
    });
}

//GUARDAR PUBLICACION/////////////////////////////////////////////////////////////////////////
const save = (req, res) => {

    //recoger datos del body
    const params = req.body;

    //si no llegan dar respuesta negativa
    if (!params.text) return res.status(400).send({ status: "error", message: "No Ingreso Ninguna Publicacion" });

    //crear y rellenar el objeto del modelo
    let publication = new Publication(params);
    publication.user = req.user.id;

    //guartdar objeto en bbdd
    publication.save((err, publicationStored) => {
        if (err || !publicationStored) {
            return res.status(404).send({ status: "error", message: "No se Guardo la Publicacion" });
        }

        return res.status(200).json({
            status: "success",
            message: "Publicacion Guardada",
            publication: publicationStored
        });
    });

}

//SACAR UNA PUBLICACION EN CONCRETO/////////////////////////////////////////////////////////////////////////
const detail = (req, res) => {

    //Sacar id de publicacion de la url
    const publicationId = req.params.id;

    //find con la condicion del id
    Publication.findById(publicationId, (err, publicationStored) => {

        if (err || !publicationStored) {
            return res.status(404).send({ status: "error", message: "No existe la publicacion" });
        }

        //devolver respuesta
        return res.status(200).json({
            status: "success",
            message: "Mostrar Publicacion",
            publication: publicationStored
        });

    });
}


//ELIMINAR PUBLICACIONES/////////////////////////////////////////////////////////////////////////
const remove = (req, res) => {

    //Sacar el Id de la publicacion a eliminar
    const publicationId = req.params.id;

    // Find y luego remove
    Publication.find({ "user": req.user.id, "_id": publicationId }).remove(err => {

        if (err) {
            return res.status(500).json({
                status: "error",
                message: "No se ha eliminado la publicacion"
            });
        }

        //devolver respuesta
        return res.status(200).json({
            status: "success",
            message: "Eliminar Publicacion",
            publication: publicationId
        });

    });
}

//LISTAR PUBLICACIONES DE UN USUARIO EN CONCRETO//////////////////////////////////////////////////////////
const user = (req, res) => {

    //Sacar Id de ususario
    const userId = req.params.id;

    //Controlar la pagina
    let page = 1;
    let itemsPerPage = 4;
    if (req.params.page) page = req.params.page;

    //Find, populate, ordenar, paginar
    Publication.find({ "user": userId })
                .sort("-create_at")//Ordenando de la publicacion mas reciente con el (-)
                .populate("user", '-password -__v -role')//Populate trate el objeto a travez de su id
                .paginate(page, itemsPerPage, (err, publications, total) => {

        if(err || !publications || publications.length <= 0){
            return res.status(404).json({
                status: "error",
                message: "No hay publicaciones para mostrar"
            });
        }

        //devolver resultado
        return res.status(200).json({
            status: "success",
            message: "Publicaciones del perfil de un usuario",
            page,
            total,
            pages: Math.ceil(total/itemsPerPage),
            publications
        });
    }); 
}

//SUBIR FICHEROS/////////////////////////////////////////////////////////////////////////
const upload = (req, res) => {
    //Sacar Id de la Publicacion
    const publicationId= req.params.id;

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
    Publication.findOneAndUpdate(
      {"user":req.user.id, "_id": publicationId},
      { file: req.file.filename },
      { new: true },
      (err, publicationUpdated) => {
        if (err || !publicationUpdated) {
          return res.status(400).send({
            status: "error",
            message: "Error en al subida del avatar",
          });
        }
  
        //devolver rrespuesta
        return res.status(200).send({
          status: "success",
          publication: publicationUpdated,
          file: req.file,
        });
      }
    );
  };


//DEVOLVER ARCHIVOS M,ULTIMEDIA////////////////////////////////////////////////////////
const media = (req, res) => {
    //sacar el parametro de la url
    const file = req.params.file;
  
    //Montar el path real de la imagen
    const filePath = "./uploads/publications/" + file;
  
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

//LISTAR TODAS LAS PUBLICACIONES (FEED) //////////////////////////////////////////////////



//exportar acciones
module.exports = {
    pruebaPublication,
    save,
    detail,
    remove,
    user,
    upload,
    media
}