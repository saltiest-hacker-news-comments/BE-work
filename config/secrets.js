module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'keep it secret, keep it safe',
    environment: process.env.NODE_ENV || 'development',
};