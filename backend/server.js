const app=require('./app');
const dotenv=require('dotenv');
const cloudinary =require('cloudinary');
dotenv.config({path:"backend/config/config.env"})
const connectDatabase=require('./config/database');


connectDatabase();
cloudinary.config({
    cloud_name:"dixmd9xpj",
    api_key:"948332663228647",
    api_secret:"DXtv4GT_EbuW1hk88TsCxG2rLo4"
});

    app.listen(5500,()=>{
    console.log(`server is working on http://localhost:5500`);
})