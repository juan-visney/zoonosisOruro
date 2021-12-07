const pool = require('../../database')
const helpers = require('../../config/helpers')

const modelo = {}

modelo.insertar = async(datos) => {
    data = await pool.query('insert into adoptante set ?', [datos])
    return data.insertId
}

modelo.buscar = async(id) =>{
    data = await pool.query('select * from adoptante where idAdoptante = ?',[id])
    return data
}

module.exports = modelo