import "dotenv/config";
import amqplib from "amqplib";

const EXCHANGE_NAME = "peticiones-de-tareas";
//conectar con el broker de RabbitMQ
const connection = await amqplib.connect(process.env.RABBITMQ_BROKER_URL);
//crear un canal
const channel = await connection.createChannel();
//crear un exchange
await channel.assertExchange(EXCHANGE_NAME, "direct", {
  durable: true,
});
//Publicar un mensaje
