import { Schema, model, Connection } from 'mongoose';

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    password: { type: String, required: true },
}, { timestamps: true });

export const getUserModel = (connection: Connection) => {
    return connection.model('User', userSchema);
};
