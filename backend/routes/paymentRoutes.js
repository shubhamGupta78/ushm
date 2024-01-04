const express=require('express');
const router=express.Router();
const {isAuthenticatedUser}=require('../middleware/auth');
const {processPayments,sendStripeApiKey}=require("../controllers/paymentControllers");
router.post('/payment/process',isAuthenticatedUser,processPayments);
router.get('/stripeapikey',sendStripeApiKey);

module.exports=router;