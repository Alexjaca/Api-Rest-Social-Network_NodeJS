//importar dependencias y modulos
const User = require("../models/user");


//acciones de prueba
const pruebaUser = (req, res) => {
    return res.status(200).json({
        message: "Estamos en la Ruta del controlador pruebaUser"
    });
}

//Registro de usuarios
const register = (req, res) => {

    //recoger datos de la peticion
    let params = req.body;

    //comprobar que me llegan bien los datos (Validacion)
    if (!params.name || !params.nick || !params.password || !params.email) {
        return res.status(404).json({
            status: "Error",
            message: "Validacion Incorrecta"
        });
    }

    let newUser = new User(params);

    //control de usuarios duplicados
    User.find({
        $or: [
            { email: newUser.email.toLowerCase() },  //Validando que no exista otro email en la bd igual
            { nick: newUser.nick.toLowerCase() }  //Validando que no exista otro nick en la bd igual
        ]
    }).exec((error, users) => {
        if (error) return res.status(500).json({
            status: "Error", message: "Error en la consulta de la BD"
        });

        if (user && users.length >= 1) {
            return res.status(200).send({
                status: "success",
                message: "El usuario ya existe"
            })
        }
    })


    return res.status(200).json({
        message: "Metodo de Registro de Usuarios",
        newUser
    });
}

//exportar acciones
module.exports = {
    pruebaUser,
    register
}