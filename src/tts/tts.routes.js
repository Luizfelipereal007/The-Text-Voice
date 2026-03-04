const express = require('express');
const { gerarAudio } = require('./tts.controller');

const router = express.Router();

router.post('/', gerarAudio);

module.exports = router;

