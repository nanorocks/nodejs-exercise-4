import { z } from 'zod';

const productSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    price: z.number().positive({ message: 'Price must be a positive number' }),
    description: z.string().optional(),
    stock: z.number().int().nonnegative({ message: 'Stock must be a non-negative integer' }),
});

export default productSchema;
