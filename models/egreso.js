const mongoose = require('mongoose');

const EgresoSchema = new mongoose.Schema({
    cantidad: Number,
    fecha: Date,
    categoria: String,
    descripcion:String,
    usuario: String,
    detalle:String
});

mongoose.model('Egreso', EgresoSchema);