//micro servicio de conversion de moneda

import cote from "cote";

//bases de datos de tasas de cambip

const tasas = {
  USD_EUR: 0.85,
  EUR_USD: 1.15,
};

const responder = new cote.Responder({ name: "conversor-moneda" });

responder.on("convertir-moneda", (event, cb) => {
  const { cantidad, desde, hacia } = event;

  console.log(Date.now(), cantidad, desde, hacia);

  //consultar base de datos para extraer las tasas de cambios
  const tasa = tasas[`${desde}_${hacia}`];

  const result = cantidad * tasa;
  cb(result);
});
