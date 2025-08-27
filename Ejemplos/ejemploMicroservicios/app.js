///esta aplicacion necesita un microservicios para hacer cambios de moneda

import cote from "cote";

const requester = new cote.Requester({ name: "app" });

const event = {
  type: "convertir-moneda",
  cantidad: 100,
  desde: "USD",
  hacia: "EUR",
};

setInterval(() => {
  requester.send(event, (result) => {
    console.log(Date.now(), "app obtiene resultado:", result);
  });
}, 1000);
