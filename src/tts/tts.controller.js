const ttsService = require('./tts.service');

/**
 * Controller responsável por receber a requisição,
 * validar o corpo e delegar a geração do áudio ao service.
 */
async function gerarAudio(req, res, next) {
  try {
    const { texto, voz } = req.body || {};

    // Validar texto
    if (!texto || typeof texto !== 'string' || !texto.trim()) {
      return res.status(400).json({
        erro: 'O campo "texto" é obrigatório e deve ser uma string não vazia.'
      });
    }

    // Validar voz (opcional, usa padrão se não especificado)
    const vozSelecionada = voz || 'google';

    // Verificar se o provedor existe
    const provedores = ttsService.listarProvedores();
    if (!provedores[vozSelecionada]) {
      return res.status(400).json({
        erro: `Voz '${vozSelecionada}' não encontrada. Vozes disponíveis: ${Object.keys(provedores).join(', ')}`
      });
    }

    // Gera o áudio em memória (Buffer) via service
    const audioBuffer = await ttsService.converterTextoParaAudio(texto, vozSelecionada);

    res.setHeader('Content-Type', 'audio/mpeg');
    return res.send(audioBuffer);
  } catch (erro) {
    console.error('Erro ao gerar áudio:', erro);
    return res.status(500).json({
      erro: 'Erro interno ao converter texto em áudio.'
    });
  }
}

/**
 * Retorna a lista de vozes disponíveis
 */
function listarVozes(req, res, next) {
  try {
    const provedores = ttsService.listarProvedores();
    
    // Formatar resposta de forma mais amigável
    const vozesFormatadas = Object.entries(provedores).map(([chave, dados]) => ({
      chave,
      nome: dados.nome,
      descricao: dados.descricao,
      idioma: dados.idioma || dados.idioma
    }));

    return res.json({
      vozes: vozesFormatadas,
      padrao: 'google'
    });
  } catch (erro) {
    console.error('Erro ao listar vozes:', erro);
    return res.status(500).json({
      erro: 'Erro interno ao listar vozes.'
    });
  }
}

module.exports = {
  gerarAudio,
  listarVozes
};
