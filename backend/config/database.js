
const mongoose=require('mongoose');
const connectDatabase=()=>{
    mongoose.connect('mongodb://localhost:27017/Ushmo',{useNewUrlParser:true,useUnifiedTopology:true})
.then((data)=>{

    console.log(`mongo db connect with server:${data.connection.host}`);
}).catch((error)=>{

    console.log(error);
})
}
module.exports=connectDatabase;