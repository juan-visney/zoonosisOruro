const express = require('express')
const router = express.Router()
const passport = require('passport')
const {estaLogueado, noestaLogueado} = require('../config/authentication')
const usuarioController = require('../app/controllers/usuarioController')
const session = require('express-session')

router.get('/inicio', (req, res) => {
    if(session.user.cargo=='administrador')
        res.redirect('/administrador/')
    if(session.user.cargo=='operador')
        res.redirect('/operador/')
})

router.get('/registroAdministrador', estaLogueado, (req, res) => {
    res.render('./authentication/registroAdministrador')
})

router.get('/registroNuevoAdministrador', (req, res) => {
    res.render('./authentication/nuevoAdmin')
})

router.get('/registroOperador', estaLogueado, (req, res) => {
    res.render('./authentication/registroOperador')
})

router.get('/registroEmpleado', estaLogueado, (req, res) => {
    res.render('./authentication/registroEmpleado')
})

router.post('/registro', estaLogueado, usuarioController.registrar)

router.post('/nuevoAdmin', usuarioController.registrar)

router.post('/login', noestaLogueado, passport.authenticate('local.login',{
        successRedirect: '/inicio',
        failureRedirect: '/login',
        failureFlash: true
}))

router.get('/salir', estaLogueado, (req, res) => {
    req.logOut()
    res.redirect('/')
})

module.exports = router