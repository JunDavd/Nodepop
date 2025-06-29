import Product from "../../models/Product.js";
import { unlink } from "node:fs/promises";
import path from "node:path";
import createError from "http-errors";

export async function list(req, res, next) {
  try {
    const userId = req.apiUserId;
    //filters
    //http://localhost:3000/api/products?name=cellphone
    const filterName = req.query.name;
    //http://localhost:3000/api/products?price=33
    const filterPrice = req.query.price;
    //http://localhost:3000/api/prodcuts?tags=33
    const filterTags = req.query.tags;

    //paginations
    //http://localhost:3000/api/products?limit=2&skip=2
    const limit = req.query.limit;
    const skip = req.query.skip;

    //sorting
    //http://localhost:3000/api/products?sort=name
    //http://localhost:3000/api/products?sort=price%20name

    const sort = req.query.sort;

    const fields = req.query.fields;

    const withCount = req.query.count === "true";

    const filter = {
      owner: userId,
    };

    if (filterName) {
      filter.name = filterName;
    }

    if (filterPrice) {
      filter.price = filterPrice;
    }

    if (filterTags) {
      filter.tags = filterTags;
    }

    const products = await Product.list(filter, limit, skip, sort, fields);
    const result = { results: products };

    if (withCount) {
      const count = await Product.countDocuments(filter);
      result.count = count;
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getOne(req, res, next) {
  try {
    const productId = req.params.productId;
    const userId = req.apiUserId;

    const product = await Product.findOne({ _id: productId, owner: userId });
    res.json({ result: product });
  } catch (error) {
    next(error);
  }
}

export async function newProduct(req, res, next) {
  try {
    const productData = req.body;
    const userId = req.apiUserId;
    //create product in memory
    const product = new Product(productData);
    product.image = req.file?.filterName;
    product.owner = userId;

    //save product
    const savedProduct = await product.save();
    res.status(201).json({ result: savedProduct });
  } catch (error) {
    next(error);
  }
}

export async function upDate(res, req, next) {
  try {
    const productId = req.params.productId;
    const userId = req.apiUserId;
    const productData = req.body;
    productData.image = req.file?.filterName;

    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: productId,
        owner: userId,
      },
      productData,
      {
        new: true,
      }
    );

    res.json({ result: updatedProduct });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const productId = req.params.productId;
    const userId = req.apiUserId;
    //validate if product is property of the user
    const product = await Product.findById(productId);
    //validate that exists
    if (!product) {
      console.log(
        `WARNING! USER ${userId} is trying to delete no existing product`
      );
      return next(createError(404));
    }

    //validate property

    if (product.owner.toString() !== userId) {
      console.log(
        `WARNING! USER ${userId} is trying to delete Products of other users`
      );
      return next(createError(401));
    }

    if (product.image) {
      await unlink(
        path.join(
          import.meta.dirname,
          "..",
          "..",
          "public",
          "img-products",
          product.image
        )
      );
    }

    await Product.deleteOne({ _id: productId });
    res.json();
  } catch (error) {
    next(error);
  }
}
