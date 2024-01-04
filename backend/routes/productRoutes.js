const express=require('express');
const { getAllProduct,getAdminProducts, deleteProduct, createProduct, productDetails, updateProduct,createProductReview ,getReviews,deleteReview} = require('../controllers/productController');
const {isAuthenticatedUser,authorizeRoles}=require('../middleware/auth');

const router=express.Router();
const multer=require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname)
    },
  })
  
  const uploadStorage = multer({ storage: storage });
  
router.get('/products',getAllProduct);
router.get('/admin/products',isAuthenticatedUser,authorizeRoles("admin"),getAdminProducts);
 router.post('/admin/product/new',isAuthenticatedUser,authorizeRoles("admin"),uploadStorage.array("file", 10),createProduct);
router.put('/admin/product/:id',isAuthenticatedUser,authorizeRoles("admin"),updateProduct)
router.delete('/admin/product/:id',isAuthenticatedUser,authorizeRoles("admin"),deleteProduct);
router.get('/product/:id',productDetails);
router.get('/admin/product/:id',isAuthenticatedUser,authorizeRoles("admin"),productDetails);

router.put('/review',isAuthenticatedUser,createProductReview);
router.post('/admin/product/delete/review/:id',deleteReview);
router.get('/product/reviews/:id',getReviews);
router.get('/admin/product/reviews/:id',getReviews);


module.exports=router;