const pool = require('../../database')
const helpers = require('../../config/helpers')

const modelo = {}

modelo.insertar = async(datos) => {
    data = await pool.query('insert into adopcion set ?', [datos])
    return data
}

modelo.buscar = async(id) =>{
    data = await pool.query('select * from adopcion where idAdopcion = ?',[id])
    return data
}

modelo.pendientes = async() => {
    const estado = 'pendiente'
    data = await pool.query('select * from adopcion where estado = ?', [estado])
    return data
}
modelo.actualizarEstado = async(estado,id) => {
    return await pool.query('update adopcion set estado = ? where idAdopcion = ?' , [estado , id])
}

module.exports = modelo