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

        if(err || !publicationStored){
            return res.status(404).send({ status: "error", message: "No existe la publicacion" });
        }

        //devolver respuesta
        return res.status(200).json({
            status: "success",
            message: "Controlador de Detalle de publicacion",
            publication: publicationStored
        });

    });


}

//LISTAR TODAS LAS PUBLICACIONES/////////////////////////////////////////////////////////////////////////

//LISTAR PUBLICACIONES DE UN USUARIO EN CONCRETO/////////////////////////////////////////////////////////////////////////

//ELIMINAR PUBLICACIONES/////////////////////////////////////////////////////////////////////////

//SUBIR FICHEROS/////////////////////////////////////////////////////////////////////////

//DEVOLVER ARCHIVOS M,ULTIMEDIA/////////////////////////////////////////////////////////////////////////

//exportar acciones
module.exports = {
    pruebaPublication,
    save,
    detail
}