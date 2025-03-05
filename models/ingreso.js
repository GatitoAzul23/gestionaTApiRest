const mongoose = require('mongoose');

const IngresoSchema = new mongoose.Schema({
    cantidad: Number,
    fecha: Date,
    categoría: String
});

mongoose.model('Ingreso', IngresoSchema);