const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
const produtosRoutes = require('./routes/produto');

app.use('/api/produtos', produtosRoutes);

app.get('/', (req, res) => {
  res.send('Servidor ligado com sucesso!');
});

app.listen(PORT, () => {
  console.log(`Servidor ativo e rodando na porta ${PORT}`);
});
