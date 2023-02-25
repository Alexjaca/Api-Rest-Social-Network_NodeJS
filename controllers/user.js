//importar dependencias y modulos
const bcrypt = require("bcrypt");//encriptacion
const User = require("../models/user");

//importar servicios
const jwt = require("../services/jwt");


//acciones de prueba///////////////////////////////////////////////////////////////////
const pruebaUser = (req, res) => {
    return res.status(200).json({
        message: "Estamos en la Ruta del controlador pruebaUser"
    });
}


//Registro de usuarios///////////////////////////////////////////////////////////////////
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
        newUser.save((err, userStored) => {
            if (err || !userStored) {
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


//Login de usuarios///////////////////////////////////////////////////////////////////
const login = (req, res) => {

    //Recoger parametros del body
    let params = req.body;

    if (!params.email || !params.password) {
        return res.status(500).send({
            status: "Error",
            message: "Faltan datos del ususario por enviar"
        });
    }

    //Buscar si el usuatrio existe en la bbdd
    User.findOne({ email: params.email })
        //.select({ "password": 0 }) //para que no me muestre el password
        .exec((err, user) => {
            if (err || !user) {
                return res.status(500).send({
                    status: "Error",
                    message: "El ususario no existe en la bbdd"
                });
            }

            //comprobar contraseña
            let pass= bcrypt.compareSync(params.password, user.password);

            if(!pass){
                return res.status(500).send({
                    status: "Error",
                    message: "No te has identificado correctamente"
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
                    nick: user.nick
                },
                token
            });

        });
}



//exportar acciones
module.exports = {
    pruebaUser,
    register,
    login
}