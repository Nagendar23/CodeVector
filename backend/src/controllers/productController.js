import mongoose from "mongoose";
import Product from "../models/Product.js";
import { CATEGORIES } from "../constants/categories.js";

export const getProducts = async(req,res)=>{
    try{
        const parsedLimit = parseInt(req.query.limit, 10);
        const limit = Number.isNaN(parsedLimit) 
        ? 20
        : Math.min(Math.max(parsedLimit,1),100);

        //snapshot handling
    const snapshotTime = req.query.snapshotTime
      ? new Date(req.query.snapshotTime)
      : new Date();
    if (Number.isNaN(snapshotTime.getTime())) {
      return res.status(400).json({
        message: "Invalid snapshotTime",
      });
    }



        let query={
            createdAt:{
                $lte:snapshotTime,
            },
        };

        //category filter
        if(req.query.category){
            if(!CATEGORIES.includes(req.query.category)){
                return res.status(400).json({message:"Invalid category"})
            }
            query.category = req.query.category;
        }

        // cursor pagination
        if(req.query.cursor){
            try{
                const decoded = Buffer.from(req.query.cursor, "base64").toString("utf8");
                const cursorData = JSON.parse(decoded);
                
                // Validate cursor data structure
                if(!cursorData || !cursorData.createdAt || !cursorData._id){
                    return res.status(400).json({message:"Invalid cursor"});
                }
                
                // Validate date
                const cursorDateObj = new Date(cursorData.createdAt);
                if(Number.isNaN(cursorDateObj.getTime())){
                    return res.status(400).json({message:"Invalid cursor"});
                }
                
                // Validate ObjectId
                if(!mongoose.Types.ObjectId.isValid(cursorData._id)){
                    return res.status(400).json({message:"Invalid cursor"});
                }
                
                const cursorIdObj = new mongoose.Types.ObjectId(cursorData._id);
                
                query={
                    ...query,
                    $or:[
                        {
                            createdAt:{
                                $lt: cursorDateObj, 
                            },
                        },
                        {
                            createdAt: cursorDateObj,
                            _id:{
                                $lt: cursorIdObj, 
                            },
                        },
                    ],
                };
            }catch(error){
                return res.status(400).json({message:"Invalid cursor"});
            }
        }
        
        //fetch one extra record
        const products = await Product.find(query)
        .sort({
            createdAt:-1,
            _id:-1,
        })
        .limit(limit + 1)
        .lean();

        const hasMore = products.length > limit;
        
        if(hasMore){
            products.pop();
        }

        //generating next cursor
        let nextCursor = null;
        if(hasMore && products.length>0){
            const lastProduct = products[products.length - 1];

            nextCursor = Buffer.from(
                JSON.stringify({
                    createdAt:lastProduct.createdAt,
                    _id: lastProduct._id,
                })
            ).toString("base64");
        }
        
        return res.status(200).json({
            items:products,
            count:products.length,
            hasMore,
            nextCursor,
            snapshotTime: snapshotTime.toISOString(),
        });
    }catch(error){
        console.error("Error while getting products:", error);
        return res.status(500).json({message:"Internal server error"});
    }
}; 