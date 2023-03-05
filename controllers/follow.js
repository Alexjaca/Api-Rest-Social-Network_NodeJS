//IMPORTANDO MODELOS    
//const Follow = require("../models/follow");
const User = require("../models/user");


//acciones de prueba
const pruebaFollow = (req, res) =>{
    return res.status(200).json({
        message: "Estamos en la Ruta del controlador pruebaFollow"
    });
}


//Accion de guardar un follow (accion de seguir)

//Accion de borrar un follow (accion dejr de seguir)

//Acccion listado de usuarios que estoy siguiendo

//Accion listado de usuarios queme siguen

//exportar acciones
module.exports = {
    pruebaFollow
}