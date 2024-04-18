const express = require('express');
const sql = require('mysql2/promise');7

const router = express.router();

const configDatabase = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'produto'
}

router.post('/', async (req, res) => {
    try {
        const connection = await sql.createConnection(configDatabase)

        const newProduct = {
            codprod: req.body.codprod,
            numlote: req.body.numlote,
            nomeprod: req.body.nomeprod,
            validade: req.body.validade,
            datafab: req.body.datafab,

        }

        const [result] = await connection.query(
            'INSERT INTO produtos (codprod, numlote, nomeprod, validade, datafab  VALUES (?, ?, ?, ?, ?)'
            [newProduct.codprod, newProduct.numlote, newProduct.nomeprod, newProduct.validade, newProduct.datafab])
        

        connection.end()

        res.status(201).json({message: 'Produto cadastrado com sucesso'})
    } catch (error) {
        console.error('Erro ao cadastrar o produto')
        res.status(500).json({message: 'Erro no servidor ao cadastrar o produto'})
    }
})

router.get('/', async (req, res) => {
    try {
        const connection = await mysql.createConnection(configDatabase)

        const [lines] = await connection.query('SELECT * FROM produtos')
        connection.end()

        res.status(200).json(lines)
    } catch (error) {
        console.error('Erro ao listar os produtos')
        res.status(500).json({error: 'Erro no servidor ao listar os produtos!'})
    }
})

module.exports = router