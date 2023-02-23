const mongoose = require("mongoose");

const connection = async() =>{
    try{
        mongoose.set("strictQuery", false);
        await mongoose.connect("mongodb://127.0.0.1:27017/mi_redsocial");
        console.log("Conectados a la Base de Datos mi_redsocial");
    }catch(error){
        console.log(error);
        throw new Error("No se a podido conectar a la base de datos");
    }
}

module.exports= connection;
