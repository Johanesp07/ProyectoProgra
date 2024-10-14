const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const fs = require('fs');

const app = express();
const port = 3000;

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'tu_usuario', //Debes asignar un usuario a tu base de datos
    password: '1234', //Debes asignar una contraseña para ese usuario
    database: 'boletas'
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

// Configurar body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Ruta para manejar el envío del formulario
app.post('/enviar-boleta', (req, res) => {
    const boletaData = {
        boletaNum: req.body.boletaNum,  // Este campo es 'readonly', asegúrate de generarlo correctamente
        cliente: req.body.cliente,
        tecnico: req.body.tecnico,
        fecha: req.body.fecha,
        numeroIncidencia: req.body.numeroIncidencia,
        modelo: req.body.modelo,
        serie: req.body.serie,
        motivoServicio: req.body.motivoServicio,
        condicionEquipo: req.body.condicionEquipo,
        accionTomada: req.body.accionTomada,
        motivoLlamada: req.body.motivoLlamada,
        ubicacionFalla: req.body.ubicacionFalla,
        tipoFalla: req.body.tipoFalla,
        horaInicialViaje: req.body.horaInicialViaje,
        horaFinalViaje: req.body.horaFinalViaje,
        horaInicialTrabajo: req.body.horaInicialTrabajo,
        horaFinalTrabajo: req.body.horaFinalTrabajo,
        checklistAmbiente: JSON.stringify(req.body.checklistAmbiente || []),
        checklistInsumos: JSON.stringify(req.body.checklistInsumos || []),
        checklistUnidades: JSON.stringify(req.body.checklistUnidades || []),
    };

    const sql = 'INSERT INTO boleta_servicio SET ?';
    db.query(sql, boletaData, (error, results) => {
        if (error) {
            console.error('Error al insertar la boleta:', error);
            return res.status(500).send('Error al enviar la boleta de servicio');
        }

        // Crear o actualizar el archivo boletas.txt
        const boletaString = JSON.stringify(boletaData, null, 2) + '\n'; // Formato de la boleta
        fs.appendFile('boletas.txt', boletaString, (err) => {
            if (err) {
                console.error('Error al guardar en el archivo:', err);
                return res.status(500).send('Error al enviar la boleta de servicio');
            }
            res.send('Boleta de Servicio enviada exitosamente y guardada en boletas.txt');
        });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
