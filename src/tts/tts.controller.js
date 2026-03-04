const ttsService = require('./tts.service');

// Controller responsável por receber a requisição,
// validar o corpo e delegar a geração do áudio ao service.
async function gerarAudio(req, res, next) {
  try {
    const { texto } = req.body || {};

    if (!texto || typeof texto !== 'string' || !texto.trim()) {
      return res.status(400).json({
        erro: 'O campo \"texto\" é obrigatório e deve ser uma string não vazia.'
      });
    }

    // Gera o áudio em memória (Buffer) via service
    const audioBuffer = await ttsService.converterTextoParaAudio(texto);

    res.setHeader('Content-Type', 'audio/mpeg');
    return res.send(audioBuffer);
  } catch (erro) {
    console.error('Erro ao gerar áudio:', erro);
    return res.status(500).json({
      erro: 'Erro interno ao converter texto em áudio.'
    });
  }
}

module.exports = {
  gerarAudio
};

