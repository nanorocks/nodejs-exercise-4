import { Router } from 'express';
import validate from '../middleware/validate';
import productSchema from '../schemas/productSchema';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../controllers/product.controller';
import { tenantMiddleware } from '../middleware/tenant-middleware';

const productsRouter = Router();

// Use tenantMiddleware for all routes in this router
productsRouter.use(tenantMiddleware);

// Route to create a product
productsRouter.post('/', validate(productSchema), createProduct);

// Route to get all products
productsRouter.get('/', getAllProducts);

// Route to get a single product by ID
productsRouter.get('/:id', getProductById);

// Route to update a product by ID
productsRouter.put('/:id', validate(productSchema), updateProduct);

// Route to delete a product by ID
productsRouter.delete('/:id', deleteProduct);

export default productsRouter;
