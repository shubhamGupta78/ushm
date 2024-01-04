const express=require('express');
const router=express.Router();

const {newOrder,getSingleOrders,getMyOrders,getAllOrders,updateOrder,deleteOrder}= require('../controllers/orderController');
const {isAuthenticatedUser,authorizeRoles}=require('../middleware/auth');

router.post('/order/new',isAuthenticatedUser,newOrder);

//router.get('/order/:id',isAuthenticatedUser,authorizeRoles("admin"),getSingleOrders);
router.get('/order/me',isAuthenticatedUser,getMyOrders);

router.get('/order/:id',isAuthenticatedUser,getSingleOrders);
router.get('/admin/order/:id',isAuthenticatedUser,authorizeRoles("admin"),getSingleOrders);

router.get('/admin/orders',isAuthenticatedUser,authorizeRoles("admin"),getAllOrders);

router.put('/admin/order/:id',isAuthenticatedUser,authorizeRoles("admin"),updateOrder);


router.delete('/admin/order/:id',isAuthenticatedUser,authorizeRoles("admin"),deleteOrder);
module.exports=router;