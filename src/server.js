const express = require('express');
const ttsRouter = require('./tts/tts.routes');

const app = express();

app.use(express.json());

app.use('/tts', ttsRouter);

// Middleware de tratamento genérico de erros
app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    erro: 'Erro interno do servidor'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

