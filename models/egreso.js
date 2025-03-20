const mongoose = require('mongoose');

const EgresoSchema = new mongoose.Schema({
    cantidad: Number,
    fecha: Date,
    categoria: String,
    usuario: String
});

mongoose.model('Egreso', EgresoSchema);