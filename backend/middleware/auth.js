const jwt=require('jsonwebtoken');
const user=require('../models/userModel');


exports.isAuthenticatedUser=async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token)
    {
        res.status(401).json({
            success:false,
            message:"please login first"
        });
 

    }
    else
    {
    try{

    const decodedData = jwt.verify(token, "shubh123");
    req.user=await user.findById(decodedData.id);
    }
    catch(err)
    {
        if(err.name === 'TokenExpiredError') {
            const decodedData= jwt.verify(token, "shubh123", {ignoreExpiration: true} );
            req.user=await user.findById(decodedData.id);
    
        }
        
    }

  
    next();
}
   

}

exports.authorizeRoles=(...roles)=>{
    console.log(roles);
    return (req,res,next)=>{
        if(!roles.includes(req.user.role))
        {

            res.status(400).json({
                success:false,
                message:`role:${req.user.role} is not allowed to access this resource`
            });
        }
        else
        {

        next();
        }
    }
}
