const express = require('express')
const mascotaController = require('../app/controllers/mascotaController')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/verMascotas', async(req, res) => {
    const mascotas = await mascotaController.listar()
    console.log('mascotas: '+mascotas)
    res.render('./mascota/listar.hbs', {mascotas})
})

router.get('/verMascota', async(req, res) => {
    const mascota = await mascotaController.verMascota()
    res.render('./mascota/adopcion.hbs', mascota)
})

router.get('/adoptados', async(req, res) => {
    const mascotas = await mascotaController.adoptados()
    console.log(mascotas)
    res.render('./mascota/adoptados', {mascotas})
})
module.exports = router