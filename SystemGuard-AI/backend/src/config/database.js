const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let isConnecting = false;

const connectDB = async () => {
  if (isConnecting) return;
  isConnecting = true;

  try {
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/systemguard';
    
    try {
      const conn = await mongoose.connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
      });
      logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
      logger.warn(`⚠️  Local MongoDB not found. Starting In-Memory Database...`);
      
      await mongoose.disconnect();
      
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      logger.info('🚀 In-Memory MongoDB Connected');
      
      const User = require('../models/User');
      if (await User.countDocuments() === 0) {
        logger.info('🌱 Database is empty. Seeding initial data...');
        await require('../../scripts/seedData')();
      }
    }
  } catch (error) {
    logger.error(`❌ Database connection failed: ${error.message}`);
    process.exit(1);
  } finally {
    isConnecting = false;
  }
};

mongoose.connection.on('disconnected', () => {
  if (!mongoServer) {
    logger.warn('⚠️  MongoDB disconnected. Reconnecting...');
    connectDB();
  }
});

module.exports = connectDB;
