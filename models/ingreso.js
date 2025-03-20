const mongoose = require('mongoose');

const IngresoSchema = new mongoose.Schema({
    cantidad: Number,
    fecha: Date,
    categoría: String,
    descripcion: String, 
    usuario: String
});

mongoose.model('Ingreso', IngresoSchema);