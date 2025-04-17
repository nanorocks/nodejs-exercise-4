import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

const validate =
    (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction): void => {
        try {
            schema.parse(req.body); // Validate the request body
            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                // errors: error.errors, // Return validation errors
            });
        }
    };

export default validate;
