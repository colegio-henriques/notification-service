import { PubSub, Message } from '@google-cloud/pubsub';
import { sendWelcomeEmail } from '../services/mailer';

const pubsub = new PubSub({
  projectId: process.env.GOOGLE_CLOUD_PROJECT || 'colegio-henriques-prod',
});

const TOPIC_NAME = 'aluno.matriculado';
const SUBSCRIPTION_NAME = 'notification-service-aluno-matriculado-sub';

export const startPubSubListener = async () => {
  const subscription = pubsub.subscription(SUBSCRIPTION_NAME);

  console.log(`[Pub/Sub] A escutar eventos em ${SUBSCRIPTION_NAME}...`);

  subscription.on('message', async (message: Message) => {
    try {
      const data = JSON.parse(message.data.toString());
      console.log(`[Pub/Sub] Evento recebido: Preparar e-mail de Boas-Vindas para ${data.first_name}`);
      
      const fullName = `${data.first_name} ${data.last_name}`;
      
      // Enviar notificação assíncrona
      await sendWelcomeEmail(fullName, data.academic_year);

      message.ack();
      console.log(`[Pub/Sub] Notificação confirmada (ACK) para a mensagem ${message.id}.`);
    } catch (error) {
      console.error(`[Pub/Sub] Erro a processar a notificação da mensagem ${message.id}:`, error);
      message.nack(); 
    }
  });

  subscription.on('error', (error) => {
    console.error(`[Pub/Sub] Erro crítico na subscrição de Notificações:`, error);
  });
};
