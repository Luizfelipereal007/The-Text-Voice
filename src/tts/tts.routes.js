const express = require('express');
const { gerarAudio, listarVozes } = require('./tts.controller');

const router = express.Router();

// Rota para gerar áudio com texto
router.post('/', gerarAudio);

// Rota para listar vozes disponíveis
router.get('/vozes', listarVozes);

module.exports = router;
