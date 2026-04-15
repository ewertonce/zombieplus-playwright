const { Pool } = require('pg')

const DbConfig = {
    user: '',
    host: '',
    database: '',
    password: '',
    port: 5432
}

export async function executeSQL(sqlScript) {
    try {
        const pool = Pool(DbConfig)
        const client = await pool.connect()
        const result = await client.query(sqlScript)
        console.log(result.rows)
    } catch(error) {
        console.log('Error while running SQL ' + error)
    }
}