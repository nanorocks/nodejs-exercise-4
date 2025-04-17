import { Request, Response } from 'express';
import productSchema from '../schemas/productSchema';
import { getProductModel } from '../models/product.model';
import { ZodError } from 'zod';

export const createProduct = async (req: Request, res: Response) => {
    const dbConnection = (req as any).dbConnection;

    if (!dbConnection) {
        return res.status(500).json({ status: 'error', message: 'Database connection not found' });
    }

    const ProductModel = getProductModel(dbConnection);

    try {
        const validatedData = productSchema.parse(req.body);
        const product = await ProductModel.create(validatedData);

        res.status(201).json({
            status: 'success',
            message: 'Product created successfully',
            data: product,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            const validationErrors = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            }));

            res.status(400).json({
                status: 'error',
                message: 'Validation failed. Please check the input fields.',
                errors: validationErrors,
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Failed to create product',
            });
        }
    }
};

export const getAllProducts = async (req: Request, res: Response) => {
    const dbConnection = (req as any).dbConnection;

    if (!dbConnection) {
        return res.status(500).json({ status: 'error', message: 'Database connection not found' });
    }

    const ProductModel = getProductModel(dbConnection);

    try {
        const products = await ProductModel.find();
        res.status(200).json({
            status: 'success',
            message: 'Products fetched successfully',
            data: products,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch products',
        });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    const dbConnection = (req as any).dbConnection;

    if (!dbConnection) {
        return res.status(500).json({ status: 'error', message: 'Database connection not found' });
    }

    const ProductModel = getProductModel(dbConnection);

    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        res.status(200).json({
            status: 'success',
            message: 'Product fetched successfully',
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch product',
        });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const dbConnection = (req as any).dbConnection;

    if (!dbConnection) {
        return res.status(500).json({ status: 'error', message: 'Database connection not found' });
    }

    const ProductModel = getProductModel(dbConnection);

    try {
        const validatedData = productSchema.parse(req.body);
        const product = await ProductModel.findByIdAndUpdate(req.params.id, validatedData, { new: true });

        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        res.status(200).json({
            status: 'success',
            message: 'Product updated successfully',
            data: product,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: (error as ZodError).errors,
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Failed to update product',
            });
        }
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const dbConnection = (req as any).dbConnection;

    if (!dbConnection) {
        return res.status(500).json({ status: 'error', message: 'Database connection not found' });
    }

    const ProductModel = getProductModel(dbConnection);

    try {
        const product = await ProductModel.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        res.status(200).json({
            status: 'success',
            message: 'Product deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete product',
        });
    }
};