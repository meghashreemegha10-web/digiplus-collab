// Run this script ONCE to clear all users from your MongoDB database.
// WARNING: This will delete ALL users. Use with caution.

const mongoose = require('mongoose');
const path = require('path');

const mongoUri = process.env.MONGO_URL || 'mongodb://localhost:27017/globaldigipulse';
const User = require(path.join(__dirname, '../models/user.js/user.js'));

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('Connected to MongoDB. Deleting all users...');
    await User.deleteMany({});
    console.log('All users deleted.');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
