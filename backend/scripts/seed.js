import mongoose from 'mongoose';
import dotenv from 'dotenv'
import {faker} from '@faker-js/faker'

import connectDB from '../src/config/db.js'
import Product from '../src/models/Product.js'

dotenv.config()

const TOTAL_PRODUCTS = 200000;
const BATCH_SIZE = 5000;
const CATEGORIES = [
  "Electronics",
  "Books",
  "Clothing",
  "Sports",
  "Home",
  "Beauty",
  "Toys",
  "Automotive",
];
const TWO_YEARS_MS = 1000 * 60 * 60 * 24 * 365 * 2;

function randomDateBetween(start, end) {
  return new Date(
    start.getTime() +
      Math.random() * (end.getTime() - start.getTime())
  )
}

function generateProduct(){
    const createdAt = randomDateBetween(
        new Date(Date.now() - TWO_YEARS_MS),
        new Date()
    )
    const updatedAt = randomDateBetween(
        createdAt,
        new Date() //updatedAt >= createdAt
    )
    return{
        name:faker.commerce.productName(),
        category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
        price: Number(faker.commerce.price()),
        createdAt,
        updatedAt,
    }
}

async function seedProducts() {
    try{
        await connectDB();
        console.log('connected to DB')

        await Product.deleteMany({});  //for fresh seeding
        console.log("Existing products delted")

        let inserted = 0;

        while (inserted < TOTAL_PRODUCTS){
            const batch = []; // temp store products 
            
            for(let i=0; i<BATCH_SIZE && inserted+i<TOTAL_PRODUCTS; i++){
                batch.push(generateProduct())
            }
            await Product.insertMany(batch);
            inserted += batch.length;
            console.log(`Inserted ${inserted}/${TOTAL_PRODUCTS}`)
        }
        const count = await Product.countDocuments();
        console.log('seeding completed');
        console.log(`total products: ${count}`)

        await mongoose.connection.close();

    }catch(error){
        console.log('seeding error: ',error)
        process.exit(1)
    }
}

seedProducts();