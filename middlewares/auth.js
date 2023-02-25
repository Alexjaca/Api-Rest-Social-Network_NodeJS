//importar dependencias o modulos
const jwt = require("jwt-simple");
const moment = require("moment");

//importar clave secreta
const libjwt = require("../services/jwt");
const secret = libjwt.secret;



//funcion de autenticacion (MIDDLEWARE)
exports.auth = (req, res, next) => {//request, response y next para saltar al siguiente metodo o funcion

    //comprobar si me llega la cabecera de autenticacion
    if(!req.headers.authorization){
        return res.status(403).send({
            status: "Error",
            message: "La peticion no tiene cabecera de autenticacion"
        });
    }

    //Limpiar el toquen       quitar ' y " del token de forma global y remplazar por '' = nada
    let token = req.headers.authorization.replace(/['"]+/g, '');


    //decodigicar el token
    try{
        let payload = jwt.decode(token, secret);

        //comprobar expiracion del token
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                status: "Error",
                message: "Token Expirado"
            });
        }

        
    //agregar datos  de ususarios a request
    req.user = payload;

    }catch(err){
        return res.status(404).send({
            status: "Error",
            message: "Token invalido"
        });
    }


    //pasara  ejecucion la accion
    next();

}


