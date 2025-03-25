const mongoose = require('mongoose');

const NotificacionSchema = new mongoose.Schema({
    fecha: Date,
    mensaje: String,
    frecuencia: String, 
    usuario: String,
    estatus: String
});

mongoose.model('Notificacion', NotificacionSchema);