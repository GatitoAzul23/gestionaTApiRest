const mongoose = require('mongoose');

const IngresoSchema = new mongoose.Schema({
    cantidad: Number,
    fecha: Date,
    categoria: String, 
    usuario: String
});

mongoose.model('Ingreso', IngresoSchema);