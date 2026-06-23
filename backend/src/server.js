import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.status(200).json({message:"API running "})
})


const startServer = async()=>{
    await connectDB();
    app.listen(PORT, ()=>{
        console.log(`Server running on the PORT ${PORT}`)
    })
};
startServer();