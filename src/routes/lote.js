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
  baseURL: 'http://localhost:3030/api',
};

const pool = mysql.createPool(configDatabase);

router.post('/cadastraLote', async (req, res) => {
  try {
    const produtosResponse = await axios.get('/produtos', configProdutosAPI);
    const produtos = produtosResponse.data;
    const numloteExists = produtos.some(produto => produto.numlote === req.body.numlote);

    if (numloteExists) {
      return res.status(400).json({ error: 'O numlote já existe na API de produtos' });
    }

    const connection = await pool.getConnection();

    const novoLote = {
      numlote: req.body.numlote,
      codprod: req.body.codprod,
      fornecedor: req.body.fornecedor,
      numvalid: req.body.numvalid,
      StatusLote: req.body.StatusLote
    };
    const [result] = await connection.query(
      'INSERT INTO lotes (numlote, codprod, fornecedor, numvalid, StatusLote) VALUES (?, ?, ?, ?, ?)',
      [novoLote.numlote, novoLote.codprod, novoLote.fornecedor, novoLote.numvalid, novoLote.StatusLote]
    );

    connection.release();
    res.status(201).json({ message: 'Lote cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar lote:', error);
    res.status(500).json({ error: 'Erro interno ao cadastrar lote' });
  }
});

router.get('/listaLotes', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT id, codprod, fornecedor, StatusLote FROM lotes');

    connection.release();

    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao listar lotes:', error);
    res.status(500).json({ error: 'Erro interno no servidor ao listar lotes' });
  }
});

router.put('/updateLote', async (req, res) => {
  const loteStatus = {
    StatusLote: req.body.StatusLote,
    codprod: req.body.idProduto
  };

  try {
    const connection = await pool.getConnection();

    const query = 'UPDATE lotes SET StatusLote = ? WHERE codprod = ?';
    const [result] = await connection.execute(query, [loteStatus.StatusLote, loteStatus.codprod]);

    connection.release();

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Lote atualizado com sucesso' });
    } else {
      res.status(404).json({ error: 'Lote não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao atualizar lote:', error);
    res.status(500).json({ error: 'Erro interno no servidor ao atualizar lote' });
  }
});

module.exports = router;
