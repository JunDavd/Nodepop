import User from "../models/User.js";
import Product from "../models/Product.js";
import { io } from "../webSocketServer.js";

export async function index(req, res, next) {
  try {
    const userId = req.session.userId;
    res.locals.products = await Product.find({ owner: userId });
    res.render("home");

    setTimeout(() => {
      if (userId) {
        console.log(
          `sending welcome message to user with sessionId: ${req.session.id}`
        );
        io.to(req.session.id).emit("server-message", `welcome user ${userId}`);
      }
    }, 5000);
  } catch (error) {
    next(error);
  }
}
