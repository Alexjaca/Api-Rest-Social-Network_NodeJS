//acciones de prueba
const pruebaPublication = (req, res) =>{
    return res.status(200).json({
        message: "Estamos en la Ruta del controlador pruebaPublication"
    });
}

//exportar acciones
module.exports = {
    pruebaPublication
}