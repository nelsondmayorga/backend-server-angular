// Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express();


// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, response) => {
    if (error) throw error;

    console.log('Base de datos online');

})

// Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion correcta'
    });

});


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Expresss desde puerto 3000');
})