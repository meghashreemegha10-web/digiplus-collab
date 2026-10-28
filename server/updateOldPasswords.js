// Script to update old user passwords to bcrypt hashes
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const mongoUri = process.env.MONGO_URL || 'mongodb://localhost:27017/educateandlearn';
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

async function updatePasswords() {
  await mongoose.connect(mongoUri);
  const users = await User.find({});
  for (const user of users) {
    // If password is not already hashed (length < 30, not starting with $2)
    if (!user.password.startsWith('$2') || user.password.length < 30) {
      const hashed = await bcrypt.hash(user.password, 10);
      user.password = hashed;
      await user.save();
      console.log(`Updated password for user: ${user.username}`);
    }
  }
  console.log('Password update complete.');
  mongoose.disconnect();
}

updatePasswords();
