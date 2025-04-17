import { z } from 'zod';

const userSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    age: z.number().int().positive({ message: 'Age must be a positive integer' }).optional(), // Optional field
});

export default userSchema;