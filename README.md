# The-Text-Voice

API RESTful para converter texto em áudio (Text-to-Speech) de forma gratuita, usando Node.js, Express e a biblioteca `node-gtts`.  
O áudio é gerado em memória (Buffer) e retornado diretamente na resposta no formato MP3.

## Endpoints

- **POST** `/tts`

### Corpo da requisição (JSON)

```json
{
  "texto": "string obrigatória"
}
```

### Regras de validação e resposta

- **400 Bad Request**: se o campo `texto` não for enviado ou for vazio.
- **200 OK**: retorna o áudio MP3 diretamente no body.
  - Header `Content-Type: audio/mpeg`
- **500 Internal Server Error**: em caso de erro interno na conversão.

## Exemplo de requisição via curl

```bash
curl -X POST http://localhost:3000/tts \
  -H "Content-Type: application/json" \
  --data '{"texto": "Olá, este é um teste de conversão de texto para voz gratuito."}' \
  --output audio.mp3
```

Após executar o comando acima, o arquivo `audio.mp3` será salvo no diretório atual, contendo a fala gerada a partir do texto enviado.

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
    tts.service.js   # Service: converte texto em áudio (Buffer) usando node-gtts
```

## Notas sobre a biblioteca utilizada

- A biblioteca `node-gtts` é gratuita e usa o mecanismo de TTS do Google Translate.
- O áudio é gerado via stream e concatenado em memória em um `Buffer`, respeitando a regra de **não salvar o arquivo em disco** no lado do servidor.
