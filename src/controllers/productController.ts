import { Request, Response } from "express";
import Product from "../models/productModel";
import Joi from "joi";

// Joi validation schema for Product
const productValidationSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(5).required(),
  inventoryCount: Joi.number().integer().min(0).required(),
});

// Controller to create a product
export const createProduct = async (req: Request, res: Response) => {
  try {
    // Validate the request body using Joi
    const { error } = productValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Destructure the validated data
    const { title, description, inventoryCount } = req.body;

    // Create a new product
    const product = await Product.create({
      title,
      description,
      inventoryCount,
    });
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller to get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller to update a product by ID
export const updateProduct = async (req: Request, res: Response) => {
  try {
    // Validate the request body using Joi
    const { error } = productValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { id } = req.params;
    const { title, description, inventoryCount } = req.body;

    // Find the product by ID and update
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
    res.status(500).json({ message: "Server error" });
  }
};

// Controller to delete a product by ID
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
    res.status(500).json({ message: "Server error" });
  }
};