
const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

//Mensaje de bienvenida
console.log("Api Node para res social arrancada");

// conexion a la bd
connection();

//crear servidor node
const app = express();
const port = 3900;


// configurar cors
app.use(cors());


//convertir los datos del body en objetos json
app.use(express.json());
app.use(express.urlencoded({extended: true})); //formato form www rncode lo tranforma a json

//ruta de prueba
app.get("/prueba", (req, res)=>{
    return res.status(200).json({
        "id": 1,
        "Nombre": "Alex",
        "Apellido": "Cardenas"
    });
});

//cargar configuracion de rutas
const UserRoutes = require("./routes/user");
const FollowRoutes = require("./routes/follow");
const PublicationRoutes = require("./routes/publication");

app.use("/api/user", UserRoutes);
app.use("/api/follow", FollowRoutes);
app.use("/api/publication", PublicationRoutes);


//poner servidor o escuchar peticiones http 
app.listen(port, ()=>{
    console.log("servidor de Node corriendo en el puerto "+ port);
});