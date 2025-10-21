// netlify/functions/enviar-email.js - VERSÃO SIMPLIFICADA
import nodemailer from 'nodemailer';

export const handler = async (event) => {
  // Configurar headers para CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Lidar com preflight requests (OPTIONS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight' })
    };
  }

  // Só permite POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método não permitido' })
    };
  }

  try {
    // Pegar os dados do formulário
    const { to, subject, dados } = JSON.parse(event.body);

    console.log('📨 Recebendo agendamento de:', dados.nome);

    // Configurar email (Gmail)
    const transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'michelymassoterapia@gmail.com',
        pass: 'fzrthrzihfepxtby'
      },
    });

    // Conteúdo do email em HTML
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #07a0a4; color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0;">📅 Novo Agendamento</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Michely Massoterapia</p>
        </div>
        
        <div style="padding: 20px;">
          <div style="background: #8dd3c7; color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h2 style="margin: 0;">${dados.data_agendamento} às ${dados.horario_agendamento}</h2>
            <p style="margin: 10px 0 0 0;">Para ${dados.quantidade_pessoas} pessoa(s)</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="color: #07a0a4; margin-top: 0;">👤 Dados do Cliente</h3>
            <p><strong>Nome:</strong> ${dados.nome}</p>
            <p><strong>Email:</strong> ${dados.email}</p>
            <p><strong>Telefone:</strong> ${dados.telefone}</p>
            <p><strong>Idade:</strong> ${dados.idade} anos</p>
            <p><strong>Endereço:</strong> ${dados.endereco}</p>
          </div>
          
          ${dados.observacoes && dados.observacoes !== 'Nenhuma observação' ? `
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="color: #07a0a4; margin-top: 0;">📝 Observações</h3>
            <p>${dados.observacoes}</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; background: #e9ecef; padding: 10px; border-radius: 5px; font-size: 14px;">
            <strong>📋 Recebido em:</strong> ${dados.data_hora_solicitacao}
          </div>
        </div>
        
        <div style="background: #343a40; color: white; text-align: center; padding: 15px;">
          <p style="margin: 0;">Michely Massoterapia • Recife - PE</p>
        </div>
      </div>
    `;

    // Configurar o email
    const mailOptions = {
      from: 'Michely Massoterapia <michelymassoterapia@gmail.com>',
      to: to,
      subject: subject,
      html: htmlContent,
      text: `
NOVO AGENDAMENTO - Michely Massoterapia

Data: ${dados.data_agendamento}
Horário: ${dados.horario_agendamento}
Pessoas: ${dados.quantidade_pessoas}

CLIENTE:
Nome: ${dados.nome}
Email: ${dados.email}
Telefone: ${dados.telefone}
Idade: ${dados.idade} anos
Endereço: ${dados.endereco}

OBSERVAÇÕES:
${dados.observacoes || 'Nenhuma'}

Recebido em: ${dados.data_hora_solicitacao}
      `.trim()
    };

    // Enviar email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email enviado com sucesso para:', to);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Agendamento enviado com sucesso! Entraremos em contato para confirmação.',
        messageId: info.messageId
      })
    };

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Erro ao enviar agendamento. Tente novamente ou entre em contato diretamente pelo WhatsApp.'
      })
    };
  }
};