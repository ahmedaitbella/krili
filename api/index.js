const app = require('../src/app');
const connectDB = require('../src/config/database');

let isConnected = false;

const handler = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error('Database connection error:', err);
      return res.status(500).json({ message: 'Database connection error' });
    }
  }

  // Pass the request to Express app
  app(req, res);
};

module.exports = handler;
