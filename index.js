import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { getAIResponse } from './googleAI.js';


const client = new Client();

client.on('ready', () => {
    console.log('Client is ready!');
});

let qrAttempts = 0;

client.on('qr', (qr) => {
  qrAttempts++;

  console.log('QR Code atualizado! Tentativa:', qrAttempts);
  qrcode.generate(qr, {small: true});
});

client.on('message', async (message) => {
  // Verifica se a mensagem vem de um grupo
  if (message.from.includes('@g.us')) {
    console.log('Mensagem de grupo ignorada');
    return; // Sai da função se for mensagem de grupo
  }

  console.log('Mensagem recebida(body):', message.body);

  try {
      // Se a mensagem for "oi", responde diretamente
      if(message.body.toLowerCase() === 'oi') {
          await message.reply('Olá!');
          return; // Importante: sai da função após responder
      }

      // Para outras mensagens, usa a IA
      const response = await getAIResponse(message.body);
      console.log('Resposta da IA:', response);
      await message.reply(response);

  } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      await message.reply('Desculpe, tive um problema ao processar sua mensagem.');
  }
});

client.initialize();
