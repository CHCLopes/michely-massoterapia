const nodemailer = ('nodemailer');
import { Vite } from 'vite';

const transporter = nodemailer.createTransport({
  host: '',
  port: '',
  secure: true,
  auth: {
    user: Vite.env.SMTP_USER,
    pass: Vite.env.SMTP_PASS
  }
});

transporter.sendMail({
  from: Vite.env.SMTP_FROM,
  to: Vite.env.SMTP_FROM,
  subject: '',
  html: ''
}).then(() => {console.log('Email enviado com sucesso!')}).catch(() => {console.log('Erro ao enviar email!')});

export default transporter;