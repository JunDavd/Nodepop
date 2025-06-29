import path from "node:path";
import express from "express";
import logger from "morgan";
import connectMongoose from "./lib/connectMongoose.js";
import * as homeController from "./controllers/homeController.js";
import * as sessionManager from "./lib/sessionManager.js";
import * as loginController from "./controllers/loginController.js";
import * as productController from "./controllers/productsController.js";
import * as apiLoginController from "./controllers/api/apiLoginController.js";
import * as apiProductsController from "./controllers/api/apiProductsController.js";
import * as localeController from "./controllers/localeController.js";
import cookieParser from "cookie-parser";
import * as jwtAuth from "./lib/jwtAuthMiddleware.js";
import upload from "./lib/uploadConfigure.js";
import i18n from "./lib/i18nConfigure.js";

await connectMongoose();
console.log("connected to mongoDB");

const app = express();

app.set("views", "views");
app.set("view engine", "html");
app.engine("html", (await import("ejs")).__express);

app.locals.appName = "NodePop";

/**
 * General rutes
 */

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(import.meta.dirname, "public")));

/**
 * API routes
 */

app.post("/api/login", apiLoginController.loginJWT);
app.get("/api/products", jwtAuth.guard, apiProductsController.list);
app.get(
  "/api/products/:productId",
  jwtAuth.guard,
  apiProductsController.getOne
);
app.post(
  "/api/products",
  jwtAuth.guard,
  upload.single("image"),
  apiProductsController.newProduct
);
app.put(
  "/api/products/:productId",
  upload.single("image"),
  jwtAuth.guard,
  apiProductsController.upDate
);
app.delete(
  "/api/products/:productId",
  jwtAuth.guard,
  apiProductsController.deleteProduct
);

/**
 * application rutes
 */
app.use(cookieParser());
app.use(sessionManager.middleware);
app.use(sessionManager.useSessionInViews);
app.use(i18n.init);
app.get("/change-locale/:locale", localeController.changeLocale);
app.get("/", homeController.index);
app.get("/login", loginController.index);
app.post("/login", loginController.loginUserPost);
app.get("/logout", loginController.logout);
app.get("/products/new", sessionManager.guard, productController.index);
app.post(
  "/products/new",
  sessionManager.guard,
  upload.single("image"),
  productController.addProduct
);
app.get(
  "/products/delete/:productId",
  sessionManager.guard,
  productController.deleteProdcut
);

app.use((err, req, res, next) => {
  if (err.array) {
    err.message =
      "invalid request : " +
      err
        .array()
        .map((e) => `${e.location} ${e.type} ${e.path} ${e.msg}`)
        .join(",");

    err.status = 422;
  }

  res.status(err.status || 500);
  // res.send('Ocurrio un error: ' + err.message)

  //set locals, including error informartion in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODEAPP_ENV === "development" ? err : {};
  res.render("error");
});

export default app;
