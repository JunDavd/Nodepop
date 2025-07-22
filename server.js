import "dotenv/config";
import http from "node:http";
import app from "./app.js";
import { setupWebSocketServer } from "./webSocketServer.js";

const port = process.env.PORT || 3000;

//create http server
const server = http.createServer(app);

setupWebSocketServer(server);

server.on("error", (err) => console.error(err));
server.on("listening", () => {
  console.log(`server started on http://localhost:${port}`);
});
server.listen(port);
