// emailServer.js - Versão corrigida
import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração FIXA do transporter (sem variáveis de ambiente por enquanto)
const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'michelymassoterapia@gmail.com', // Substitua pelo seu email
    pass: 'fzrthrzihfepxtby' // Substitua pela sua senha de app
  },
});

// Verificar configuração do email
console.log('🔧 Configurando servidor de email...');
console.log('📧 Email:', 'michelymassoterapia@gmail.com');
console.log('🚪 Porta:', PORT);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor de email funcionando',
    timestamp: new Date().toISOString()
  });
});

// Rota para enviar email
app.post('/api/enviar-email', async (req, res) => {
  console.log('📨 Recebendo solicitação de email...');
  
  try {
    const { to, subject, dados } = req.body;

    // Validação dos dados
    if (!to || !subject || !dados) {
      return res.status(400).json({
        success: false,
        message: 'Dados incompletos'
      });
    }

    console.log('📋 Enviando email para:', to);
    console.log('📝 Assunto:', subject);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: 'Arial', sans-serif; 
            background: #f5f5f5; 
            margin: 0; 
            padding: 20px; 
            line-height: 1.6;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 16px; 
            box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
            overflow: hidden; 
          }
          .header { 
            background: linear-gradient(to right, #07a0a4, #8dd3c7); 
            color: white; 
            padding: 30px; 
            text-align: center; 
          }
          .content { 
            padding: 30px; 
          }
          .info-section { 
            background: #f8fafc; 
            border-radius: 12px; 
            padding: 20px; 
            margin: 20px 0; 
          }
          .agendamento-destaque {
            background: linear-gradient(135deg, #07a0a4, #8dd3c7);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin: 20px 0;
          }
          .solicitacao-info {
            text-align: center;
            background: #e2e8f0;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 14px;
            color: #475569;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">📅 Novo Agendamento</h1>
          </div>
          
          <div class="content">
            <div class="agendamento-destaque">
              <h2 style="margin: 0; font-size: 24px;">${dados.data_agendamento} às ${dados.horario_agendamento}</h2>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Para ${dados.quantidade_pessoas} pessoa(s)</p>
            </div>
            
            <div class="solicitacao-info">
              <strong>📋 Solicitação recebida em:</strong><br>
              ${dados.data_hora_solicitacao}
            </div>
            
            <div class="info-section">
              <h3 style="color: #07a0a4; margin-top: 0;">👤 Dados do Cliente</h3>
              <p><strong>Nome:</strong> ${dados.nome}</p>
              <p><strong>Email:</strong> ${dados.email}</p>
              <p><strong>Telefone:</strong> ${dados.telefone}</p>
              <p><strong>Idade:</strong> ${dados.idade} anos</p>
              <p><strong>Endereço:</strong> ${dados.endereco}</p>
            </div>
            
            ${dados.observacoes && dados.observacoes !== 'Nenhuma observação' ? `
            <div class="info-section">
              <h3 style="color: #07a0a4; margin-top: 0;">📝 Observações</h3>
              <p>${dados.observacoes}</p>
            </div>
            ` : ''}
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: 'michelymassoterapia@gmail.com',
      to: to,
      subject: subject,
      html: htmlContent,
      text: `Novo agendamento de ${dados.nome} para ${dados.data_agendamento} às ${dados.horario_agendamento}`
    };

    // Enviar email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email enviado com sucesso!');
    console.log('📫 Message ID:', info.messageId);
    
    res.json({ 
      success: true, 
      message: 'Email enviado com sucesso',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao enviar email: ' + error.message
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de email rodando em http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});