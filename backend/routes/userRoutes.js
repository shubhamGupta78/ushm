const express=require('express');
const {registerUser ,loginUser,logout,forgotPassword,resetPassword,userDetails,updatePassword,updateProfile,getAllUsers,getSingleUser,updateRoles,deleteUser} = require('../controllers/userController');
const router=express.Router();
const {isAuthenticatedUser,authorizeRoles}=require('../middleware/auth');

router.post('/register',registerUser);
router.post('/login',loginUser);

router.get('/logout',logout);

router.post('/password/forgot',forgotPassword);


router.post('/password/reset/:token',resetPassword);
router.get('/me',isAuthenticatedUser,userDetails);
router.put('/me/updateProfile',isAuthenticatedUser,updateProfile);
router.put('/password/updatePassword',isAuthenticatedUser,updatePassword);

router.get('/admin/users',isAuthenticatedUser,authorizeRoles("admin"),getAllUsers);
router.get('/admin/user/:id',isAuthenticatedUser,authorizeRoles("admin"),getSingleUser);

router.put('/admin/user/update/:id',isAuthenticatedUser,authorizeRoles("admin"),updateRoles);
router.delete('/admin/user/delete/:id',isAuthenticatedUser,authorizeRoles("admin"),deleteUser);


module.exports=router;