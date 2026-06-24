import mongoose from "mongoose";
import { CATEGORIES } from "../constants/categories.js";

// const CATEGORIES = [
//   "Electronics",
//   "Books",
//   "Clothing",
//   "Sports",
//   "Home",
//   "Beauty",
//   "Toys",
//   "Automotive",
// ];

const productSchema = new mongoose.Schema(
    {
    name:{
        type:String,
        required:true,
        trim:true,
    },
    category:{
        type:String,
        enum:CATEGORIES,
        required:true,
    },
    price:{
        type:Number,
        required:true,
        min:0,
    },
},
    {
        timestamps:true
    }
);

productSchema.index({createdAt: -1, _id:-1});
productSchema.index({category:1, createdAt:-1, _id:-1})

const Product = mongoose.model("Product", productSchema);
export default Product