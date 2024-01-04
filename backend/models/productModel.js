const { kMaxLength } = require('buffer');
const mongoose=require('mongoose');

const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter product name"],
        trim:true

    },
    price:{
        type:Number,
        required:[true,"Please enter price having lesss than equal to 8 digit"],
        MaxLength:8
    },
    description:{
        type:String,
        required:[true,"Please enter description"]

    },
    rating:{
        type:Number,
        default:0

    },
    images:[
        {
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
// }
    }
    ],
    category:{
        type:String,
        required:[true,"Please enter product category"],
        
    },
    Stock:{
        type:Number,
        required:[true,"Please enter stock"],
        maxLength:4,
        default:0
    },
    numberOfReviews:{
        type:Number,
        default:0

    },
    Reviews:[
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comments:{
                type:String,
                required:true
            },
            user:{
                type:String,
                required:true
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now()
    },
    user:{
        type:mongoose.Schema.ObjectId,
        reference:'user',
        required:true
    }
})

module.exports=mongoose.model('product',productSchema)