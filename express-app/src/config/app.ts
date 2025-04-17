import dotenv from 'dotenv';

dotenv.config();

const config = {
    app: {
        port: process.env.PORT || 3000,
    },
    mongodb: {
        port: process.env.MONGO_PORT || 27017,
        username: process.env.MONGO_INITDB_ROOT_USERNAME || 'admin',
        password: process.env.MONGO_INITDB_ROOT_PASSWORD || 'password',
        host: 'localhost',
        authSource: 'admin',
    },
};

export default config;
