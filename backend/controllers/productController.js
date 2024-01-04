
const product=require('../models/productModel');
const ApiFeatures=require('../utils/apiFeatures');
const cloudinary =require('cloudinary');
const path=require('path')
const fs=require('fs')
const multer=require('multer')
// Create Product




exports.createProduct=async(req,res)=>{
    console.log(req.body);
    try{
    req.body.user=req.user.id;
    let images=[];

    if( typeof req.body.images==="string")
    {

        images.push(req.body.images);
    }
    else{

        images=req.body.images;

    }


   const imageLink=[];

   for(let i=0;i<images.length;i++)
   {
    const imagePath = images[i];
    const result=await cloudinary.v2.uploader.upload(imagePath, {
        folder: "product",
        width: 150,
        crop: "scale",
      });

      imageLink.push({

        public_id: result.public_id,
          url: result.secure_url,

      })
   }

   req.body.images=imageLink;


    const Product=new product(req.body);
    const data=await Product.save();

    res.status(200).send({

        success:true,
        Product:data
        

    });
  }
  catch(e)
  {
    console.log("value of e"+e.message)
  }

}
//get all products

// exports.createProduct = async (req, res) => {
//   console.log(req.body);
//   req.body.user = req.user.id;
//   let images = [];

//   if (typeof req.body.images === "string") {
//       images.push(req.body.images);
//   } else {
//       images = req.body.images;
//   }

//   const imageLink = [];

//   for (let i = 0; i < images.length; i++) {
//       const imagePath = images[i];
//       const imageExtension = path.extname(imagePath);
//       const imageName = `product_image_${Date.now()}_${i}${imageExtension}`;
//       const imagePathInProject = path.join(__dirname,'../../', 'images', imageName);

//       // Copy the image to the local 'images' folder
//       if (!fs.existsSync(path.join(__dirname, '../../','images'))) {
//         fs.mkdirSync(path.join(__dirname,'../../','images'));
//     }
     
//      try{
//       fs.copyFileSync(imagePath, imagePathInProject);
    //  }
    //  catch(e)
    //  {
    //    console.log("error is"+e)
    //  }

//       imageLink.push({
//           imageName: imageName,
//           imagePath: imagePathInProject,
//       });
//   }

//   req.body.images = imageLink;

//   // Assuming 'product' is your model
//   const Product = new product(req.body);
//   const data = await Product.save();

//   res.status(200).send({
//       success: true,
//       Product: data,
//   });
// };

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//       const destinationPath = path.join(__dirname, '../../', 'images');
      
//       // Create the 'images' folder if it doesn't exist
//       if (!fs.existsSync(destinationPath)) {
//           fs.mkdirSync(destinationPath);
//       }

//       cb(null, destinationPath);
//   },
//   filename: function (req, file, cb) {
//       const fileExtension = path.extname(file.originalname);
//       const fileName = `product_image_${Date.now()}${fileExtension}`;
//       cb(null, fileName);
//   }
// });

//  const upload = multer({ storage: storage });




// exports.createProduct = async (req, res) => {
//   console.log('Request reached createProduct route');

//   req.body.user = req.user.id;

//   upload.array('images', 3)(req, res, async function (err) {
//       if (err instanceof multer.MulterError) {
//           // Handle Multer error
//           return res.status(400).send({
//               success: false,
//               error: 'Multer Error'
//           });
//       } else if (err) {
//           // Handle other errors
//           console.error('Error:', err);
//           return res.status(500).send({
//               success: false,
//               error: 'Internal Server Error',
//           });
//       }

//       const imageLink = req.files.map(file => ({
//           imageName: file.filename,
//           imagePath: file.path,
//       }));

//       req.body.images = imageLink;

//       try {
//           // Assuming 'product' is your model
//           const Product = new product(req.body);
//           const data = await Product.save();

//           res.status(200).send({
//               success: true,
//               Product: data,
//           });
//       } catch (error) {
//           console.error('Error:', error);
//           res.status(500).send({
//               success: false,
//               error: 'Internal Server Error',
//           });
//       }
//   });
// };


exports.getAllProduct=async(req,res)=>{
    console.log(req.body);
    const resultPerPage = 8;
    const productCount = await product.countDocuments();
  
    const apiFeature = new ApiFeatures(product.find(), req.query)
      .search()
      .filter();
  
  
    let products = await apiFeature.query;
  
    let filteredProductsCount = products.length;
  
    
  
    products = await (apiFeature.pagination(resultPerPage)).query.clone();
    
  
    res.status(200).json({
      success: true,
      products,
      productCount,
      resultPerPage,
      filteredProductsCount,
    });
   
}


exports.getAdminProducts=async(req,res)=>{
    const products=await product.find();   
    
  
    res.status(200).json({
      success: true,
      products
    });
  }


  exports.updateProduct = async (req, res, next) => {

    try{
    let Product = await product.findById(req.params.id);
  console.log(req.body)
    if (!Product) {

      res.status(400).json({
          success: false,
          message:"not found",
        });
    
  }
    // Images Start Here
    let images = [];
  
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
 
    if (images !== undefined) {
      // Deleting Images From Cloudinary
      
      for (let i = 0; i < Product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(Product.images[i].public_id);
      }
  
      const imagesLinks = [];
  
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });
  
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
  
      req.body.images = imagesLinks;
    }
  
    Product = await product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
      Product,
    });
  }
  catch(e)
  {
    console.log(e)
  }
  }
  
  

exports.deleteProduct=async(req,res)=>{
    let Product=await product.findOne({_id:req.params.id});
    
       if(!Product)
    {
        res.status(500).json({
            success:false,
            message:"product not found"
        });
    }
    else{

        for(let i=0;i<Product.images.length;i++){

        await cloudinary.v2.uploader.destroy(Product.images[i].public_id);
        }

        await product.deleteOne({_id:req.params.id});
        res.status(200).json({
            success:true,
            message:"product deleted successfully"
        });


    }
    
}

exports.productDetails=async(req,res)=>{

    const Product=await product.findOne({_id:req.params.id});

    if(!Product)
    {
        res.status(500).json({
            success:false,
            message:"product not found"
        });
    }
    else{
    
    res.status(201).json({
        success:true,
        Product
    });
}
}

exports.createProductReview = async (req, res, next) => {
    const { rating, comments, productId } = req.body;
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comments,
    };
    const Product = await product.findById(productId);

    const isReviewed = Product.Reviews.find(
      (rev) => rev.user == req.user._id
    );

    if (isReviewed) {
      Product.Reviews.forEach((rev) => {
        if (rev.user==req.user._id){
        console.log("verfied");
          (rev.rating = rating), (rev.comments = comments);
        }

      });
    } else {
      Product.Reviews.push(review);
      Product.numOfReviews = Product.Reviews.length;
    }
  
    let avg = 0;
  
    Product.Reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    Product.ratings = avg / Product.Reviews.length;
  
    await Product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
      message:"thanks for reviewing this product"
    });

}

// get all reviews of a single product

exports.getReviews=async(req,res)=>{
    
    const productId=req.params.id;
    console.log(productId);
    const Product=await product.findOne({_id:productId});
 
    if(Product)
    {
        const reviews=Product.Reviews;
        res.status(200).json({
            success:true,
            reviews
        });
    }
    else
    {
        res.status(400).json({
            success:false,
            message: "product not found"
        });    
    }


}

exports.deleteReview=async(req,res)=>{
    
    const productId=req.params.id;
    const reviewIdToDelete=req.body.reviewId;
    console.log(reviewIdToDelete);
    const updatedProduct = await product.findOneAndUpdate(
        { _id: productId },
        { $pull: { Reviews: { _id: reviewIdToDelete } } },
        { new: true }
      );

      console.log(updatedProduct.Reviews);


    
        res.status(200).json({
            success:true,
            message:"Review deleted successfully"
        });
   


}

