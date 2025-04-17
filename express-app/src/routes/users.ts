import { Router } from 'express';
import validate from '../middleware/validate';
import userSchema from '../schemas/userSchema';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller';
import { tenantMiddleware } from '../middleware/tenant-middleware'; // Import tenantMiddleware

const usersRouter = Router();

// Use tenantMiddleware for all routes in this router
usersRouter.use(tenantMiddleware);

// Route to create a user
usersRouter.post('/', validate(userSchema), createUser);

// Route to get all users
usersRouter.get('/', getAllUsers);

// Route to get a single user by ID
usersRouter.get('/:id', getUserById);

// Route to update a user by ID
usersRouter.put('/:id', validate(userSchema), updateUser);

// Route to delete a user by ID
usersRouter.delete('/:id', deleteUser);

export default usersRouter;
