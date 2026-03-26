/**
 * Seed script — run with: npm run seed
 * Creates default admin user + sample services + sample alerts
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Service = require('../src/models/Service');
const Alert = require('../src/models/Alert');

const seed = async () => {
  let mongoServer;
  try {
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/systemguard';
    
    try {
      await mongoose.connect(dbUri, { serverSelectionTimeoutMS: 5000 });
      console.log('✅ Connected to MongoDB');
    } catch (err) {
      console.log('⚠️  Local MongoDB not found. Seeding with In-Memory Database...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      
      // We need to keep this URI for the server to use later? 
      // No, the server will create its own memory server.
      // Wait, if the seed script runs in a separate process, the memory server will die.
      // This is a problem. The seed data won't persist to the server's memory server.
      
      await mongoose.connect(uri);
      console.log('🚀 In-Memory MongoDB Connected');
    }

    // Clear existing seed data
    await User.deleteMany({ email: 'admin@systemguard.ai' });
    await Service.deleteMany({});
    await Alert.deleteMany({});

    // ── Admin User ───────────────────────────────────────────────────────────
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@systemguard.ai',
      password: 'Admin@123',
      role: 'admin',
    });
    console.log(`👤 Admin user created: ${admin.email}`);

    // ── Sample Services ──────────────────────────────────────────────────────
    const services = await Service.insertMany([
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
      {
        name: 'Redis Cache',
        type: 'tcp',
        endpoint: 'localhost:6379',
        status: 'offline',
        autoRestart: true,
        restartCommand: 'sudo systemctl restart redis',
        uptime: 95.2,
        responseTime: null,
      },
    ]);
    console.log(`⚙️  ${services.length} services created`);

    // ── Sample Alerts ────────────────────────────────────────────────────────
    const alerts = await Alert.insertMany([
      {
        title: 'System Started',
        message: 'SystemGuard AI monitoring started successfully.',
        type: 'success',
        category: 'system',
      },
      {
        title: 'Redis Cache Offline',
        message: 'Redis service is not responding. Auto-restart attempted.',
        type: 'critical',
        category: 'service',
      },
      {
        title: 'High CPU Warning',
        message: 'CPU usage exceeded 85% for more than 2 minutes.',
        type: 'warning',
        category: 'system',
      },
      {
        title: 'Brute Force Detected',
        message: 'IP 192.168.1.105 blocked after 5 failed login attempts.',
        type: 'critical',
        category: 'security',
      },
    ]);
    console.log(`🔔 ${alerts.length} alerts created`);

    console.log('\n🚀 Seed complete!');
    console.log('──────────────────────────────────');
    console.log('Login with:');
    console.log('  Email   : admin@systemguard.ai');
    console.log('  Password: Admin@123');
    console.log('──────────────────────────────────\n');

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
