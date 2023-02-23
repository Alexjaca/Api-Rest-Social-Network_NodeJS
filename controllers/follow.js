//acciones de prueba
const pruebaFollow = (req, res) =>{
    return res.status(200).json({
        message: "Estamos en la Ruta del controlador pruebaFollow"
    });
}

//exportar acciones
module.exports = {
    pruebaFollow
}