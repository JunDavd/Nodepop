import jwt from "jsonwebtoken";
import createError from "http-errors";

export function guard(req, res, next) {
  //sacar el token de: cabecera, body o query string
  const tokeJWT = req.get("Authorization") || req.body.jwt || req.query.jwt;
  //si no me han mandado token------> error
  if (!tokeJWT) {
    next(createError(401, "Not token provided"));
    return;
  }
  //compriobar que el token es valid
  jwt.verify(tokeJWT, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      next(createError(401, "Invalid toke"));
      return;
    }
    //Apuntamos al id del usuario logado en la request
    //para que los proximos middlewares no tengan que volver a aabrir el token y puedan leerlo
    req.apiUserId = payload.user_id;
    next();
  });
}
