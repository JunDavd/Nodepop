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

let keepSending = true;

while (true) {
  //Publicar un mensaje
  const message = {
    tarea: "enviar un email" + "-" + Date.now(),
  };

  //esperar si puedo enviar mas mensajes o si tengo que darle mas tiempo
  if (!keepSending) {
    console.warn(
      "**** CANAL SATURADO, ESPERAMOS A QUE SE DRENE EL BUFFER DE ENTRADA****"
    );
    //escuchar el evento drain para saber cuando ya hay espacio
    await new Promise((resolve) => {
      channel.on("drain", resolve);
    });
  }

  keepSending = channel.publish(
    EXCHANGE_NAME,
    "*",
    Buffer.from(JSON.stringify(message))
  );
  console.log(`Message sendt to queque at: ${Date.now()}`);
  await new Promise((resolve) => setTimeout(resolve, 100));
}
