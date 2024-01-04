const express=require('express');
const app =express();
const cors=require('cors');
const path=require('path');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const fileUpload=require('express-fileupload');
//const errorMiddleware=require('./middleware/error');
const product=require('./routes/productRoutes');
const order=require('./routes/orderRoutes');
const user=require('./routes/userRoutes');
const payment=require('./routes/paymentRoutes');
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit in this example
  })
);
app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit to your needs
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(cors({
    origin: 'http://localhost:3000', // Set the origin to your client's URL
    credentials: true, // Allow credentials
  }));

//Route imports




app.use('/api/vi/',order);
app.use('/api/vi',product);
app.use('/api/vi',user);
app.use('/api/vi',payment);
///app.use(errorMiddleware);

app.get('/',(req,res)=>{
    res.status(201).send({"message":"hi shubh"});
})

module.exports=app;