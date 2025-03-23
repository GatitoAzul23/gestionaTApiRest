var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Egreso = mongoose.model('Egreso');
const Usuario = mongoose.model('Usuario');


module.exports = router;