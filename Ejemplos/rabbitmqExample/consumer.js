import "dotenv/config";
import amqplib from "amqplib";

const QUEQUE_NAME = "cola-de-tareas"; //bandeja de entrada del servicio

//conectar con el broker de RabbitMQ
const connection = await amqplib.connect(process.env.RABBITMQ_BROKER_URL);
//crear un canal
const channel = await connection.createChannel();

//asegurar que mi cola de entrada de mensajes exista
await channel.assertQueue(QUEQUE_NAME, {
  durable: true,
});

channel.prefetch(20);
//suscribirnos a la cola

channel.consume(QUEQUE_NAME, async (message) => {
  //simulamos que se procesa el mensaje
  const payload = JSON.parse(message.content.toString());
  console.log(payload);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  channel.ack(message);
});
