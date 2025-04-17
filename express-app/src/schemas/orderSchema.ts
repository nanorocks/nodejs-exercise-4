import { z } from 'zod';

const orderSchema = z.object({
    user: z.string().min(1, { message: 'User ID is required' }),
    products: z.array(
        z.object({
            product: z.string().min(1, { message: 'Product ID is required' }),
            quantity: z.number().int().positive({ message: 'Quantity must be a positive integer' }),
        })
    ),
    totalAmount: z.number().positive({ message: 'Total amount must be a positive number' }),
    status: z.enum(['pending', 'completed', 'cancelled']).default('pending'),
});

export default orderSchema;
