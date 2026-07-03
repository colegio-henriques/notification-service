import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Usamos Ethereal Email em dev para interceptar emails fictícios
// Em produção, usaremos SendGrid, Mailgun ou Google Workspace SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER || 'fake_user',
    pass: process.env.SMTP_PASS || 'fake_password'
  }
});

export const sendWelcomeEmail = async (studentName: string, academicYear: string) => {
  try {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h2 style="color: #4f46e5;">Bem-vindo(a) ao Colégio Henriques!</h2>
        <p>Olá <strong>${studentName}</strong>,</p>
        <p>Confirmamos a recepção e o processamento da sua matrícula para o ano lectivo <strong>${academicYear}</strong>.</p>
        <p>O seu acesso ao Portal Académico será gerado em breve. Qualquer dúvida, entre em contacto com a secretaria.</p>
        <br/>
        <p>Com os melhores cumprimentos,<br/><strong>Direcção do Colégio Henriques</strong></p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"Colégio Henriques" <naoresponder@colegiohenriques.edu>',
      to: 'aluno_teste@example.com', // Na prática, leríamos do objecto do evento
      subject: 'Confirmação de Matrícula ✔',
      html: htmlTemplate,
    });

    console.log(`[Mailer] E-mail de boas-vindas enviado para ${studentName} (ID: ${info.messageId})`);
  } catch (error) {
    console.error('[Mailer] Erro ao enviar e-mail:', error);
    throw error;
  }
};
