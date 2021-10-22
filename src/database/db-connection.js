const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN);
        console.log('Connection established with the database');
    } catch (error) {
        console.error(error);
        throw new Error('Database connection error');
    }
}

module.exports = {
    dbConnection
}