import { Request, Response, NextFunction } from 'express';
import { switchDatabase } from '../db/switch-database';

export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID is required' });
    }

    try {
        const dbConnection = await switchDatabase(tenantId);

        if (!dbConnection || typeof dbConnection !== 'object') {
            return res.status(500).json({ error: 'Invalid database connection' });
        }
        
        (req as any).dbConnection = dbConnection;
        
        next();
    } catch (error) {
        console.error('Error connecting to tenant database:', error);
        res.status(500).json({ error: 'Failed to connect to tenant database' });
    }
};
