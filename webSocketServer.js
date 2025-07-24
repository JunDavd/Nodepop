import { Server } from "socket.io";
import * as sessionManager from "./lib/sessionManager.js";

export let io;

export function setupWebSocketServer(httpServer) {
  io = new Server(httpServer);

  io.engine.use(sessionManager.middleware);

  io.on("connection", (socket) => {
    console.log("nueva conexion de un cliente con id", socket.id);

    const sessionId = socket.request.session.id;

    //crear una sala de chat en el sessionId
    socket.join(sessionId);

    socket.on("chat-message", (payload) => {
      console.log(
        `Mensaje recibido del cliente id: ${socket.id} y texto: "${payload}"`
      );

      //crear una sala de chat con el session id del usuario
      io.emit("chat-message", payload); //emite a todos
    });
  });
}
