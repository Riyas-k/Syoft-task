import { Request, Response } from "express";
import Product from "../models/productModel";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, inventoryCount } = req.body;

    const product = await Product.create({
      title,
      description,
      inventoryCount,
    });
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, inventoryCount } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { title, description, inventoryCount },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.log(error);
  }
};
