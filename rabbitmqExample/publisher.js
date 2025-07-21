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

while (true) {
  //Publicar un mensaje
  const message = {
    tarea: "enviar un email" + "-" + Date.now(),
  };
  console.log(`Message sendt to queque at: ${Date.now()}`);

  channel.publish(EXCHANGE_NAME, "*", Buffer.from(JSON.stringify(message)));
  await new Promise((resolve) => setTimeout(resolve, 100));
}
