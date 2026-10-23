import 'dotenv/config';

const required = ['JWT_SECRET'];
for (const name of required) {
  if (!process.env[name] && process.env.NODE_ENV !== 'test') {
    throw new Error(`${name} environment variable is required`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/secure_banking',
  jwtSecret: process.env.JWT_SECRET || 'test-only-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
};

