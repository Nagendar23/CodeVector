import Product from "../models/Product.js";

export const getProducts = async(req,res)=>{
    try{
        const parsedLimit = parseInt(req.query.limit, 10);

        const limit = Number.isNaN(parsedLimit) 
        ? 20
        : Math.min(Math.max(parsedLimit,1),100)

        const products = await Product.find()
        .sort({
            createdAt:-1,
            _id:-1,
        })
        .limit(limit)
        .lean()  //instead of mongooose doc instances it returns plain js objects

        res.status(200).json({
            items:products,
            count:products.length
        })

        console.log(`fetched ${products.length} products`)
    }catch(error){
        console.log("Error while getting products ",error)
        return res.status(500).json({message:"Internal server error"})
    }
} 