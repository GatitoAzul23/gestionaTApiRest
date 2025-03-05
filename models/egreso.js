const mongoose = require('mongoose');

const EgresoSchema = new mongoose.Schema({
    cantidad: Number,
    fecha: Date,
    categoria: String
});

mongoose.model('Egreso', EgresoSchema);