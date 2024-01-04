const user=require('../models/userModel');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const cloudinary =require('cloudinary');
const {sendEmail}=require('../utils/sendEmail');
const { use } = require('../app');
const { urlencoded } = require('body-parser');
//Register a user

exports.registerUser=async(req,res,next)=>{

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });
    const {name,email}=req.body;
    const password=await bcrypt.hash(req.body.password,10);
    const User = await user.create({
        name,
        email,
        password,
        avatar: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      });

  // const user=await User.save();

   const token=jwt.sign({id:User._id},"shubh123",{
       expiresIn:"5d"
   });


   const cookieOptions = {
    maxAge: 3600000, // Cookie will expire in 1 hour // Requires HTTPS
    sameSite: 'Lax' // Controls when the cookie is sent
  };

  res.status(201).setHeader('Set-Cookie', `token=${token} ${Object.keys(cookieOptions).map(key => `${key}=${cookieOptions[key]}`).join('; ')}`).json({
    success: true,
    User,
    token,
  });

//   res.status(201).cookie("token", token, options).json({
//     success: true,
//     User,
//     token,
//   });
}
// Authenticate a user
exports.loginUser=async(req,res,next)=>{
    const {email,password}=req.body;

    if(!email || !password){
    res.status(400).send({
        success:false,
        message:"please enter email or password"
    });
}

    const User=await user.findOne({email}).select("+password");
    if(!User)
    {
        res.status(400).send({
            success:false,
            message:"invalid username or password"
        });
    }
else{
    const isPasswordMatch=await bcrypt.compare(password,User.password);

    if(!isPasswordMatch)
    {
        res.status(400).send({
            success:false,
            message:"invalid username or password"
        });
    }
else{
    const token=jwt.sign({id:User._id},"shubh123",{
        expiresIn:5
    });

    var date = new Date();
    var tokenExpire = date.setTime(date.getTime() + (360 * 1000));
    res.status(201)
       .cookie('token', token, { maxAge: tokenExpire, httpOnly: true })
       .json({
    success: true,
    User,
    token,
  });
}
}


}

exports.logout=(req,res)=>{

    res.status(200).cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    }).json({
        success:true,
        message:"logout successfully"
    })
}

exports.forgotPassword= async(req,res)=>{
    const User=await user.findOne({email:req.body.email});
    if(User)
    {
    const resetToken=crypto.randomBytes(20).toString("hex");
    const tokenCrypto=crypto.createHash("sha256").update(resetToken).digest("hex");
    const updateToken=await user.findOneAndUpdate({_id:User._id},{
        resetPasswordToken:tokenCrypto,
        resetPasswordExpire:new Date(Date.now()+20*60*1000)
        
    });
    const resetPasswordUrl=`${req.protocol}://localhost:3000/password/reset/${resetToken}`
    const message=`your password reset token is :- \n\n ${resetPasswordUrl}`
    try{
        

        await sendEmail({
            email:req.body.email,
            subject:'ecommerce password recovery',
            message
        })
        res.status(201).json({
            success:true,
            message:`email sent to ${req.body.email} successfully`
        })
    }
    catch(e)
    {
      
        const updateToken=await user.findOneAndUpdate({_id:User._id},{
            resetPasswordToken:null,
            resetPasswordExpire:null
            
        });
        res.status(500).json({
            success:false,
            message:"not able to send the mail"
        })
    }


}
else
{
    res.status(400).json({
        success:false,
        message:"User not found"
    });
}


}

exports.resetPassword=async(req,res)=>{
console.log("efkjnef hnshubh");
    const resetToken=req.params.token;
    const tokenCrypto=crypto.createHash("sha256").update(resetToken).digest("hex");
console.log(tokenCrypto);
    const User=await user.findOne({resetPasswordToken:tokenCrypto});

    console.log("value of User is"+User);
    if(!User)
    {

        console.log("vle"+false);
        res.status(500).json({

            success:false,
            message:"invalid token"

        })
    }
    else
    {

        console.log("vle"+true);
         const password=await bcrypt.hash(req.body.password,10);
         User.password=password;

         User.resetPasswordToken=null;
         User.resetPasswordExpire=null;
        await User.save();
        res.status(201).json({

            success:true,
            message:"password updated successfully"

        })
    }

}

exports.userDetails=async(req,res)=>{


    if(req.user)
    {
            const User=await user.findOne({_id:req.user.id});
            res.status(200).json({
                success:true,
                User
            })
    }
    else
    {
        res.status(400).json({
            success:false,
            message:"please login first"

        })
    }
}

exports.updatePassword=async(req,res)=>{
const {oldPassword,newPassword,confirmPassword}=req.body;
    const User=await user.findOne({_id:req.user.id}).select("+password");

    if(User)
    {
        const isPasswordMatch=await bcrypt.compare(oldPassword,User.password);
        if(!isPasswordMatch)
        {
            res.status(400).json({
                success:false,
                message:"old password is incorrect"
    
            });
        }
        else
        {
            if(newPassword===confirmPassword)
            {
               User.password= await bcrypt.hash(newPassword,10);
               await User.save();
               res.status(200).json({
                success:true,
                message:"password updated successfuly"
               })
            }
            else
            {
                res.status(400).json({
                success:false,
                message:"passowrd doesn't match"
    
            })
        }
            
        }
    }
    else
    {
        res.status(400).json({
            success:false,
            message:"please login first"

        })
    }


}

exports.updateProfile = async (req, res) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };
  
    console.log(newUserData);
    if (req.body.avatar !== "") {
      console.log("its true");
      try {
        let User = await user.findById(req.user.id);
  
        const imageId = User.avatar.public_id;
  
        await cloudinary.v2.uploader.destroy(imageId);
  
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });
  
        newUserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
        console.log(newUserData);
      } catch (error) {
        console.error("Error updating avatar:", error);
        return res.status(500).json({
          success: false,
          message: "Unable to update profile please retry again",
        });
      }
    }
  
    try {
      console.log(newUserData);
      await user.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
  
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(400).json({
        success: false,
        message: "Unable to update profile, please try again",
      });
    }
  };

exports.getAllUsers=async(req,res)=>{
    const User=await user.find();
    res.status(200).json({
        success:true,
        User
    });
}
exports.getSingleUser=async(req,res)=>{
    const User=await user.findOne({_id:req.params.id});
    res.status(200).json({
        success:true,
        User
    });
}

exports.updateRoles=async(req,res)=>{
    const userData={
        role:req.body.role
    }
    
    const User=await user.findByIdAndUpdate(req.params.id,userData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    if(!User)
    {
        res.status(500).json({
            success:false,
            message:"User not found"

        })
    }
    else
    {
        res.status(200).json({
            success:true,
            message:"Role updated successfully"
            
        });
    
    }
    


}

exports.deleteUser=async(req,res)=>{

    const User=await user.findByIdAndDelete({_id:req.params.id});
    if(!User)
    {
        res.status(500).json({
            success:false,
            message:"User not found"

        })
    }
    else
    {
        res.status(200).json({
            success:true,
            message:"User deleted successfully"
            
        });
    
    }
    



}