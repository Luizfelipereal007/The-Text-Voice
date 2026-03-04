const gTTS = require('node-gtts');
const { EdgeTTS } = require('node-edge-tts');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Provedores disponíveis
const PROVEDORES = {
  'google': {
    nome: 'Google Translate',
    provedor: 'google',
    idioma: 'pt',
    descricao: 'Voz padrão do Google Translate (robotizada)'
  },
  'edge-pt-female': {
    nome: 'Microsoft Edge - Portugues Feminino',
    provedor: 'edge',
    voz: 'pt-BR-FranciscaNeural',
    idioma: 'pt-BR',
    descricao: 'Voz neural feminina do Microsoft Edge'
  },
  'edge-pt-male': {
    nome: 'Microsoft Edge - Portugues Masculino',
    provedor: 'edge',
    voz: 'pt-BR-AntonioNeural',
    idioma: 'pt-BR',
    descricao: 'Voz neural masculina do Microsoft Edge'
  }
};

// Instancia o gTTS com idioma padrão
const ttsGoogle = gTTS('pt');

/**
 * Converte texto em áudio usando Google Translate
 * @param {string} texto
 * @returns {Promise<Buffer>}
 */
function converterComGoogle(texto) {
  return new Promise((resolve, reject) => {
    try {
      const chunks = [];
      const stream = ttsGoogle.stream(texto);

      stream.on('data', (chunk) => {
        chunks.push(chunk);
      });

      stream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Converte texto em áudio usando Microsoft Edge TTS
 * @param {string} texto
 * @param {string} voz - Nome da voz Edge TTS
 * @returns {Promise<Buffer>}
 */
async function converterComEdge(texto, voz) {
  // Criar nome de arquivo temporário único
  const tempFile = path.join(os.tmpdir(), `tts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp3`);
  
  try {
    // Criar instância do EdgeTTS
    const tts = new EdgeTTS({
      voice: voz,
      outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
    });
    
    // Síntese de voz para arquivo
    await tts.ttsPromise(texto, tempFile);
    
    // Ler o arquivo e retornar como buffer
    const buffer = fs.readFileSync(tempFile);
    
    // Excluir arquivo temporário
    fs.unlinkSync(tempFile);
    
    return buffer;
  } catch (err) {
    // Limpar arquivo temporário em caso de erro
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    throw err;
  }
}

/**
 * Converte texto em áudio usando o provedor especificado
 * @param {string} texto
 * @param {string} provedor - Chave do provedor (ex: 'google', 'edge-pt-female')
 * @returns {Promise<Buffer>}
 */
async function converterTextoParaAudio(texto, provedor = 'google') {
  const provedorConfig = PROVEDORES[provedor];
  
  if (!provedorConfig) {
    throw new Error(`Provedor '${provedor}' não encontrado. Provedores disponíveis: ${Object.keys(PROVEDORES).join(', ')}`);
  }
  
  // Determinar qual provedor usar
  if (provedorConfig.provedor === 'google') {
    return converterComGoogle(texto);
  } else if (provedorConfig.provedor === 'edge') {
    return converterComEdge(texto, provedorConfig.voz);
  } else {
    throw new Error(`Provedor '${provedor}' não implementado`);
  }
}

/**
 * Retorna lista de provedores disponíveis
 * @returns {Object}
 */
function listarProvedores() {
  return PROVEDORES;
}

module.exports = {
  converterTextoParaAudio,
  listarProvedores,
  PROVEDORES
};
