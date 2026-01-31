const app = require('../src/app');
const connectDB = require('../src/config/database');

let isConnected = false;

const handler = async (req, res) => {
  // Connect to database on cold start
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log('✅ MongoDB connected successfully');
    } catch (err) {
      console.error('❌ Database connection error:', err);
      return res.status(500).json({ 
        error: 'Database connection failed',
        details: err.message 
      });
    }
  }

  // Let Express handle the request
  return app(req, res);
};

module.exports = handler;
