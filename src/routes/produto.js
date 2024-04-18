const express = require('express');
const mysql = require('mysql2/promise');

const router = express.Router();

const configDatabase = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'produto'
};

router.post('/', async (req, res) => {
  try {
    const connection = await mysql.createConnection(configDatabase);

    const newProduct = {
      codprod: req.body.codprod,
      numlote: req.body.numlote,
      nomeprod: req.body.nomeprod,
      validade: req.body.validade,
      datafab: req.body.datafab
    };

    const [result] = await connection.query(
      'INSERT INTO produtos (codprod, numlote, nomeprod, validade, datafab) VALUES (?, ?, ?, ?, ?)',
      [newProduct.codprod, newProduct.numlote, newProduct.nomeprod, newProduct.validade, newProduct.datafab]
    );

    connection.end()

    res.status(201).json({ message: 'Produto cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    res.status(500).json({ error: 'Erro interno no servidor ao cadastrar produto' });
  }
})

router.get('/', async (req, res) => {
  try {
    const connection = await mysql.createConnection(configDatabase);
    const [rows] = await connection.query('SELECT * FROM produtos');

    connection.end()

    res.status(200).json(rows)
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ error: 'Erro interno no servidor ao listar produtos' });
  }
})

module.exports = router
