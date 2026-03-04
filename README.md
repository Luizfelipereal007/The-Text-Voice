# The-Text-Voice

API RESTful para converter texto em áudio (Text-to-Speech) usando Node.js e Express. Suporta múltiplos provedores de voz, incluindo o Google Translate (gratuito) e Microsoft Edge TTS (vozes neurais gratuitas).

O áudio é gerado em memória (Buffer) e retornado diretamente na resposta no formato MP3.

## Endpoints

- **POST** `/tts` - Gerar áudio a partir de texto
- **GET** `/tts/vozes` - Listar vozes disponíveis

### Corpo da requisição (JSON)

```json
{
  "texto": "string obrigatória",
  "voz": "chave da voz (opcional, padrão: google)"
}
```

### Parâmetro `voz`

Vozes disponíveis:

| Chave | Nome | Idioma |
|-------|------|--------|
| `google` | Google Translate | Português |
| `edge-pt-female` | Microsoft Edge - Português Feminino | pt-BR |
| `edge-pt-male` | Microsoft Edge - Português Masculino | pt-BR |

### Regras de validação e resposta

- **400 Bad Request**: se o campo `texto` não for enviado ou for vazio, ou se a voz especificada não existir.
- **200 OK**: retorna o áudio MP3 diretamente no body.
  - Header `Content-Type: audio/mpeg`
- **500 Internal Server Error**: em caso de erro interno na conversão.

## Exemplos de requisição via curl

### Listar vozes disponíveis

```bash
curl http://localhost:3000/tts/vozes
```

### Usar voz padrão (Google Translate - robotizada)

```bash
curl -X POST http://localhost:3000/tts \
  -H "Content-Type: application/json" \
  --data '{"texto": "Olá, este é um teste de conversão de texto para voz."}' \
  --output audio_google.mp3
```

### Usar voz neural do Microsoft Edge (Português Feminino)

```bash
curl -X POST http://localhost:3000/tts \
  -H "Content-Type: application/json" \
  --data '{"texto": "Olá, esta é uma voz neural muito mais natural!", "voz": "edge-pt-female"}' \
  --output audio_edge_female.mp3
```

### Usar voz neural do Microsoft Edge (Português Masculino)

```bash
curl -X POST http://localhost:3000/tts \
  -H "Content-Type: application/json" \
  --data '{"texto": "Olá, esta é uma voz neural masculina!", "voz": "edge-pt-male"}' \
  --output audio_edge_male.mp3
```

## Como rodar o projeto

### Pré-requisitos

- Node.js (versão 18+ recomendada)
- npm ou yarn

### Passos

1. Instalar as dependências:

```bash
npm install
```

2. Rodar em modo desenvolvimento (com nodemon):

```bash
npm run dev
```

3. Ou rodar em modo produção simples:

```bash
npm start
```

4. A API ficará disponível em:

```text
http://localhost:3000
```

## Estrutura do projeto

```text
src/
  server.js          # Configuração do Express e inicialização do servidor
  tts/
    tts.routes.js    # Definição das rotas (/tts)
    tts.controller.js# Controller: valida entrada e monta resposta
    tts.service.js   # Service: converte texto em áudio usando Google ou Edge TTS
```

## Notas sobre os provedores de voz

- **Google Translate** (`node-gtts`): Gratuito, mas com voz robotizada. Usa o mecanismo público do Google Translate.
- **Microsoft Edge TTS** (`node-edge-tts`): Totalmente gratuito, usa vozes neurais de alta qualidade da Microsoft. Não requer API key.
