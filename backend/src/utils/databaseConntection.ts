import mongoose from 'mongoose';

const DB_URI = process.env.MONGODB_URL || "";

// connect database
const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log('Connected to MongoDB!!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default connectToDatabase;
