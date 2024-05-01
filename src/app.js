const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

const produtosRoutes = require('./routes/produto');
const loteRoutes = require('./routes/lote');


app.use('/api/produtos', produtosRoutes);
app.use('/api/lotes', loteRoutes);


app.get('/', (req, res) => {
  res.send('Servidor ligado com sucesso!');
});

app.listen(PORT, () => {
  console.log(`Servidor ativo e rodando na porta ${PORT}`);
});
