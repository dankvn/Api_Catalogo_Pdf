import mongoose from 'mongoose';
const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    await mongoose.connect( MONGO_URI, {
  
    });
    console.log('MongoDB conectado');
    console.log('📑API-MONGODB');
  } catch (err) {
    console.error('Error de conexión:', err.message);
    process.exit(1);
  }
};

export default connectDB;
