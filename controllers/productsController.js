import Product from "../models/Product.js";

export function index(req, res, next) {
  res.render("add-product");
}

export async function addProduct(req, res, next) {
  try {
    const { name, price, image, tags } = req.body;
    const userId = req.session.userId;
    console.log("=== DEBUG INFO ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    console.log("req.files:", req.files);
    console.log("Content-Type:", req.get("Content-Type"));
    console.log("==================");
    const product = new Product({
      name,
      price,
      image: req.file ? req.file.filename : image,
      tags,
      owner: userId,
    });

    await product.save();
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}

export async function deleteProdcut(req, res, next) {
  try {
    const userId = req.session.userId;
    const productId = req.params.productId;
    await Product.deleteOne({ _id: productId, owner: userId });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}
