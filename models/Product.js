import { name } from "ejs";
import mongoose, { Schema } from "mongoose";

//schema od the product, include index
const productSchema = new Schema(
  {
    // name: { type: String, unique: true },
    name: String,
    price: Number,
    image: String,
    tags: [String],
    owner: { type: Schema.Types.ObjectId, ref: "User", index: true },
  },
  {
    collection: "products",
  }
);

productSchema.statics.list = function (filter, limit, skip, sort, fields) {
  const query = Product.find(filter);
  query.limit(limit);
  query.skip(skip);
  query.sort(sort);
  query.select(fields);
  return query.exec();
};

const Product = mongoose.model("Products", productSchema);

export default Product;
