import express from "express";
import auth from "../middlewares/auth.js";
import productService from "../services/productService.js";

const productRouter = express.Router();

productRouter.post("/", auth.verifyAccessToken, async (req, res, next) => {
  const createdProduct = await productService.create(req.body);
  return res.json(createdProduct);
});

productRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await productService.getById(id);
  return res.json(product);
});

export default productRouter;
