import { Request, Response } from 'express';
import { getUserModel } from '../models/user.model';
import userSchema from '../schemas/userSchema';
import { ZodError } from 'zod'; // Ensure ZodError is imported

export const createUser = async (req: Request, res: Response) => {
    const dbConnection = (req as any).dbConnection; // Use type assertion
    
    if (!dbConnection) {
        return res.status(500).json({ status: 'error', message: 'Database connection not found' });
    }

    const UserModel = getUserModel(dbConnection);

    try {
        console.log('Request Body:', req.body); // Debug log

        // Validate the request body using the user schema
        const validatedData = userSchema.parse(req.body);

        // Create a new user in the database
        const user = await UserModel.create(validatedData);

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: user,
        });
    } catch (error) {
        if (error instanceof ZodError) { // Correct reference to ZodError
            // Handle validation errors
            const validationErrors = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            }));

            res.status(400).json({
                status: 'error',
                message: 'Validation failed. Please check the input fields.',
                errors: validationErrors, // Provide detailed validation errors
            });
        } else {
            // Handle other errors
            res.status(500).json({
                status: 'error',
                message: 'Failed to create user',
            });
        }
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    const dbConnection = (req as any).dbConnection; // Use type assertion
    
    if (!dbConnection) {
        return res.status(500).json({ status: 'error', message: 'Database connection not found' });
    }

    const UserModel = getUserModel(dbConnection);

    try {
        const users = await UserModel.find(); // Fetch all users from the database
        
        res.status(200).json({
            status: 'success',
            message: 'Users fetched successfully',
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch users',
        });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const dbConnection = (req as any).dbConnection;
    if (!dbConnection) {
        return res.status(500).json({ status: 'error', message: 'Database connection not found' });
    }

    const UserModel = getUserModel(dbConnection);

    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        res.status(200).json({
            status: 'success',
            message: 'User fetched successfully',
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch user',
        });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const dbConnection = (req as any).dbConnection;
    if (!dbConnection) {
        return res.status(500).json({ status: 'error', message: 'Database connection not found' });
    }

    const UserModel = getUserModel(dbConnection);

    try {
        const validatedData = userSchema.parse(req.body);
        const user = await UserModel.findByIdAndUpdate(req.params.id, validatedData, { new: true });

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        res.status(200).json({
            status: 'success',
            message: 'User updated successfully',
            data: user,
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
                message: 'Failed to update user',
            });
        }
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const dbConnection = (req as any).dbConnection;
    if (!dbConnection) {
        return res.status(500).json({ status: 'error', message: 'Database connection not found' });
    }

    const UserModel = getUserModel(dbConnection);

    try {
        const user = await UserModel.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        res.status(200).json({
            status: 'success',
            message: 'User deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete user',
        });
    }
};
