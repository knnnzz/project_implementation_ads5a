const express = require('express');
const mysql = require('mysql2/promise');
const axios = require('axios');


const router = express.Router();
const configDatabase = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lote'
};

const configProdutosAPI = {
  baseURL: 'http://localhost:3000/api', 
};

router.post('/', async (req, res) => {
  try {
    const produtosResponse = await axios.get('/produtos', configProdutosAPI);
    const produtos = produtosResponse.data;
    const numloteExists = produtos.some(produto => produto.numlote === req.body.numlote);

    if (numloteExists) {
      return res.status(400).json({ error: 'O numlote já existe na API de produtos' });
    }

    const connection = await mysql.createConnection(configDatabase);
    const novoLote = {
      numlote: req.body.numlote,
      codprod: req.body.codprod,
      fornecedor: req.body.fornecedor,
      numvalid: req.body.numvalid,
      statusprod: req.body.statusprod
    };
    const [result] = await connection.query(
      'INSERT INTO lotes (numlote, codprod, fornecedor, numvalid, statusprod) VALUES (?, ?, ?, ?, ?)',
      [novoLote.numlote, novoLote.codprod, novoLote.fornecedor, novoLote.numvalid, novoLote.statusprod]
    );

    connection.end();
    res.status(201).json({ message: 'Lote cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar lote:', error);
    res.status(500).json({ error: 'Erro interno ao cadastrar lote' });
  }
});

router.get('/', async (req, res) => {
  try {
    const connection = await mysql.createConnection(configDatabase);
    const [rows] = await connection.query('SELECT * FROM lotes');

    connection.end()

    res.status(200).json(rows)
  } catch (error) {
    console.error('Erro ao listar lotes:', error);
    res.status(500).json({ error: 'Erro interno no servidor ao listar lotes' });
  }
})

module.exports = router;
