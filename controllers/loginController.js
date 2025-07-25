import User from "../models/User.js";
import { io } from "../webSocketServer.js";

export function index(req, res, next) {
  res.locals.error = "";
  res.locals.email = "";
  res.render("login");
}

export async function loginUserPost(req, res, next) {
  try {
    const { email, password } = req.body;

    const redir = req.query.redir;

    const foundUser = await User.findOne({ email: email });
    if (!foundUser || !(await foundUser.comparePassword(password))) {
      res.locals.error = "Invalid user or password";
      res.locals.email = email;
      res.render("login");
    }
    req.session.userId = foundUser.id;

    res.redirect(redir ? redir : "/");
    //Enviar email al usuario
    foundUser.sendEmail("Bienvenido", "Bienvenido a Nodeapp.");
  } catch (error) {
    next(error);
  }
}

export function logout(req, res, next) {
  const oldeSessionId = req.session.id;
  req.session.regenerate((err) => {
    if (err) {
      next(err);
      return;
    }
    io.in(oldeSessionId).disconnectSockets();
    res.redirect("/");
  });
}
