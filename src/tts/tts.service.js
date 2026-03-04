const gTTS = require('node-gtts');

// Instancia o TTS com idioma padrão (pt-br).
// A biblioteca é gratuita pois usa o mecanismo público do Google Translate.
const tts = gTTS('pt');

/**
 * Converte texto em áudio MP3 e retorna um Buffer em memória.
 * @param {string} texto
 * @returns {Promise<Buffer>}
 */
function converterTextoParaAudio(texto) {
  return new Promise((resolve, reject) => {
    try {
      const chunks = [];

      // A lib expõe um stream que podemos acumular em memória.
      const stream = tts.stream(texto);

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

module.exports = {
  converterTextoParaAudio
};

