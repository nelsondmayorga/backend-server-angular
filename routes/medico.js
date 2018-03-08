var express = require('express');

var mdAutenticacion = require('../middelwares/autenticacion');

var app = express();

var Medico = require('../models/medico');



// =========================================
// Obtener todos los medicos
// =========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {

                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medico',
                        errors: err
                    });
                }

                Medico.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });

                });


            });



});


// =========================================
// Obtener único medico
// =========================================
app.get('/:id', (req, res) => {

	var id = req.params.id;

	Medico.findById(id)
			.populate('usuario', 'nombre email img')
			.populate('hospital')
			.exec( (err, medico) => {

				if (err) {
		            return res.status(500).json({
		                ok: false,
		                mensaje: 'Error al buscar medico',
		                errors: err
		            });
		        }

		        if (!medico) {

		            return res.status(400).json({
		                ok: false,
		                mensaje: 'El id ' + id + ' no se encuentra en la base de datos',
		                errors: { message: 'No existe medico con ese id' }
		            });

		        }


		        return res.status(200).json({
		                ok: true,
		                medico: medico
		            });


			})



});




// =========================================
// Actualizar medico
// =========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {

            return res.status(400).json({
                ok: false,
                mensaje: 'El id ' + id + ' no se encuentra en la base de datos',
                errors: { message: 'No existe medico con ese id' }
            });

        }


        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });


    });


});





// =========================================
// Crear un nuevo medico
// =========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital

    });


    medico.save((err, medicoGuardado) => {

        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });

    });

});

// =========================================
// Eliminar medico por id
// =========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoEliminado) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar medico',
                errors: err
            });
        }

        if (!medicoEliminado) {
            res.status(500).json({
                ok: false,
                mensaje: 'No existe medico con ese id',
                errors: { message: 'No existe medico con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoEliminado
        });

    });

});


module.exports = app;