import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { startPubSubListener } from './config/pubsub';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8084;

// Endpoint apenas de verificação (Health Check)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', service: 'notification-service' });
});

app.listen(PORT, () => {
  console.log(`[notification-service] Servidor REST a correr na porta ${PORT}`);
  
  // Iniciar subscritor do Pub/Sub em background
  startPubSubListener().catch(console.error);
});
