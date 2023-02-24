//importar dependencias y modulos
const bcrypt = require("bcrypt");//encriptacion
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



    //control de usuarios duplicados
    User.find({
        $or: [
            { email: params.email.toLowerCase() },  //Validando que no exista otro email en la bd igual
            { nick: params.nick.toLowerCase() }  //Validando que no exista otro nick en la bd igual
        ]
    }).exec(async (error, users) => {
        if (error) return res.status(500).json({
            status: "Error", message: "Error en la consulta de la BD"
        });

        if (users && users.length >= 1) {
            return res.status(200).send({
                status: "Success",
                message: "El usuario ya existe"
            })
        }

        //Cifrar la contraseña
        let passw = await bcrypt.hash(params.password, 10);
        params.password = passw;

        //crear objeto usuario
        let newUser = new User(params);  

        //Guardar usuario en la bd
        newUser.save((err, userStored) =>{
            if(err || !userStored){
                return res.status(500).send({
                    status: "Error",
                    message: "Error al guardar el usuario en la bd"
                });
            }
            return res.status(500).send({
                status: "Success",
                message: "Usuario registrado correctamente",
                user: userStored
            });

        })
    });





}

//exportar acciones
module.exports = {
    pruebaUser,
    register
}