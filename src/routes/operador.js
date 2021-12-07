const express = require('express')
const router = express.Router()
const passport = require('passport')
const {estaLogueado, noestaLogueado} = require('../config/authentication')
const usuarioController = require('../app/controllers/usuarioController')
const mascotaController = require('../app/controllers/mascotaController')
const session = require('express-session')

router.get('/', (req, res) => {
    res.render('./operador/index')
})

router.get('/registrarMascota', (req, res) => {
    res.render('./mascota/registroMascota', {idUsuario: req.user.idUsuario})
})

router.post('/registrarMascota',estaLogueado, mascotaController.registrar)

module.exports = router