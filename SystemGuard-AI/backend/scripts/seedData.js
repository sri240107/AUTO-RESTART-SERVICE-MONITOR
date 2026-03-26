const User = require('../src/models/User');
const Service = require('../src/models/Service');
const Alert = require('../src/models/Alert');
const logger = require('../src/utils/logger');

const seedData = async () => {
  try {
    // Admin User
    await User.create({
      name: 'System Admin',
      email: 'admin@systemguard.ai',
      password: 'Admin@123',
      role: 'admin',
    });

    // Sample Services
    await Service.insertMany([
      {
        name: 'Main API Server',
        type: 'http',
        endpoint: 'http://localhost:5000/api/health',
        status: 'online',
        autoRestart: true,
        restartCommand: 'pm2 restart backend',
        uptime: 99.8,
        responseTime: 45,
      },
      {
        name: 'MongoDB Database',
        type: 'database',
        endpoint: 'localhost:27017',
        status: 'online',
        autoRestart: true,
        restartCommand: 'sudo systemctl restart mongod',
        uptime: 99.9,
        responseTime: 12,
      },
      {
        name: 'React Frontend',
        type: 'http',
        endpoint: 'http://localhost:5173',
        status: 'online',
        autoRestart: false,
        uptime: 98.5,
        responseTime: 210,
      },
    ]);

    // Sample Alerts
    await Alert.insertMany([
      {
        title: 'System Started',
        message: 'SystemGuard AI monitoring started successfully.',
        type: 'success',
        category: 'system',
      },
      {
        title: 'High CPU Warning',
        message: 'CPU usage exceeded 85% for more than 2 minutes.',
        type: 'warning',
        category: 'system',
      },
    ]);

    logger.info('✅ Initial data seeded successfully');
  } catch (err) {
    logger.error(`❌ Auto-seed failed: ${err.message}`);
  }
};

module.exports = seedData;
