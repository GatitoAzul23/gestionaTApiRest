var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");

require('dotenv').config();



//conexion a la base de datos
const mongoose = require('mongoose');
//console.log('MONGODB_URI:', process.env.MONGODB_URI); // Depuración
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

//Listado de los modelos
require('./models/usuario');
require('./models/ingreso');
require('./models/egreso');
require('./models/notificacion');


//declaracion de rutas
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var ingresosRouter = require('./routes/ingresos');
var egresosRouter = require('./routes/egresos');
var notificacionRouter = require('./routes/notificaciones');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

//HACER USO DE LAS RUTAS
app.use('/', indexRouter);
app.use('/usuarios', usersRouter);
app.use('/ingresos', ingresosRouter);
app.use('/egresos', egresosRouter);
app.use('/notificacion', notificacionRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;