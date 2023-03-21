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


//LISTAR TODAS LAS PUBLICACIONES/////////////////////////////////////////////////////////////////////////



//SUBIR FICHEROS/////////////////////////////////////////////////////////////////////////

//DEVOLVER ARCHIVOS M,ULTIMEDIA/////////////////////////////////////////////////////////////////////////

//exportar acciones
module.exports = {
    pruebaPublication,
    save,
    detail,
    remove,
    user
}