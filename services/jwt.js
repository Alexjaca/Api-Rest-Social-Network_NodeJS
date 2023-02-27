//Importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

//Clave secreta
const secret = "NICKOLE_2006_SABINE_2014_Jaca_1985_MaDrId2023";

//crear una funcion para generar tokens
const createToken = (user)=>{
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        nick: user.nick, 
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    }

    //devolver JWT tocken codificado
    return jwt.encode(payload, secret);
}

module.exports= {
    secret,
    createToken
}



