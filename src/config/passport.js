const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const pool = require('../database')
const helpers = require('./helpers')
const modelo = require('../app/models/usuarioModel')
const session = require('express-session');

passport.use('local.login', new localStrategy({
    usernameField: 'cuenta',
    passwordField: 'clave',
    passReqToCallback: true
}, async(req, cuenta, clave, done) => {
    const row = await modelo.buscarUsuario(cuenta)
    if(row.length > 0){
        const usuario = row[0]
        if(usuario.estado == 'activo'){
            const validar = await helpers.decrypt(clave, usuario.clave)
            if(validar){
                session.user = usuario
                done(null, usuario)
            }
            else{
                done(null, false, req.flash('message', 'Error en la contraseña'))
            }
        }
        else{
            done(null, false, req.flash('message', 'Esta bloqueado temporalmente, comuniquese con el administrador'))
        }
    }
    else{
        return done(null, false, req.flash('message', "El usuario no existe"))
    }
}))

passport.use('local.registro', new localStrategy({
    usernameField: 'cuenta',
    passwordField: 'clave',
    passReqToCallback: true
}, async (req, cuenta, clave, done) => {
    console.log(req.body)
    if(req.body.cargo == 'administrador' || req.body.cargo == 'operador' ){
        const nombre = req.body.nombre
        const cargo = req.body.cargo
        const cuenta = req.body.cuenta
        const clave = req.body.clave
        const ci = req.body.ci
        const celular = req.body.celular
        const foto = req.body.foto
        const estado = 'activo'
        const nuevo = {
            nombre, cargo, cuenta, clave, ci, celular, foto, estado
        }
        const result = await modelo.insertar(nuevo)
        nuevo.idUsuario = result.insertId
        session.user = nuevo
        return done(null, nuevo);
    }
    if(req.body.cargo == 'empleado'){
        const nombre = req.body.nombre
        const cargo = req.body.cargo
        const ci = req.body.ci
        const celular = req.body.celular
        const foto = req.body.foto
        const estado = 'activo'
        const nuevo = {
            nombre, cargo, ci, celular, foto, estado
        }
        const result = await modelo.insertar(nuevo)
        nuevo.idUsuario = result.insertId
        session.user = nuevo
        return done(null, nuevo);
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.idUsuario)
})

passport.deserializeUser(async (id, done) => {
    const row = await pool.query('select * from usuario where idUsuario = ?',[id])
    done(null, row[0])
})
