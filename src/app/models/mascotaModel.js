const pool = require('../../database')
const helpers = require('../../config/helpers')

const modelo = {}

modelo.insertar = async(datos) => {
    data = await pool.query('insert into mascota set ?', [datos])
    return data
}

modelo.adoptados = async() => {
    const estado = 'adoptado'
    return await pool.query('select * from mascota where estado = ?',[estado])
}

modelo.adopciones = async() => {
    const estado = 'adoptado'
    return await pool.query('select m.especie, m.foto, a.nombre, a.latitud, a.longitud from adopcion d, mascota m, adoptante a  where a.idAdoptante = d.idAdoptante and d.idMascota = m.idMascota and  m.estado = ?',[estado])
}

modelo.listar = async() => {
    const estado1 = 'adoptado'
    const estado2 = 'pendiente'
    data = await pool.query('select * from mascota where estado <> ? AND estado <> ?',[estado1 , estado2])
    return data
}

modelo.buscar = async(id) =>{
    data = await pool.query('select * from mascota where idMascota = ?',[id])
    return data
}

modelo.listarMascota = async(id) => {
    data = await pool.query('select * from mascota where idMascota = ?', [id])
    return data
}

modelo.actualizarEstado = async(id, estado) => {
    return await pool.query('update mascota set estado = ? where idMascota = ?', [estado, id])
}

modelo.pendiente = async(id) => {
    const estado = 'pendiente'
    data = await pool.query('update mascota set estado = ? where idMascota = ?', [estado, id])
    return data
}

modelo.listarEstado = async(estado) =>{
    data = await pool.query('select * from mascota where estado = ?',[estado])
    return data
}

modelo.listarEspecie = async(especie) =>{
    data = await pool.query('select * from mascota where especie = ?',[especie])
    return data
}

module.exports = modelo