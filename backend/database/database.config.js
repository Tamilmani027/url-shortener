import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB=async ()=>{
	try{
	const connect=await mongoose.connect(process.env.MONGODB_URI);
	console.log('MongoDB connected successfully')
}
catch (error){
	console.log('Failed',error.message);
	process.exit(1);
}
};

export default connectDB;
