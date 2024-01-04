const order=require('../models/orderModel');
const user=require('../models/userModel');
const product=require('../models/productModel');
const ApiFeatures=require('../utils/apiFeatures');


exports.newOrder=async(req,res)=>{

  const {shippingInfo,orderItems,paymentInfo,itemsPrice,shippingPrice,taxPrice,totalPrice}=req.body;
  
try{
    const Order=new order({
        shippingInfo,
        orderItems,
        paymentInfo,
        shippingPrice,
        taxPrice,
        itemsPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    }
        );
    const data=await Order.save();
    res.status(200).json({
        success:true,
          Order
    });
  }
  catch(e)
  {
    res.status(400).json({
      success:false,
      Message:e.message
  });
  }

}

//get single details



//get logged in user orders

exports.getMyOrders=async(req,res)=>{
    
    
    const Order=await order.find({user:req.user._id})
    if(!Order)
    {
        res.status(400).json({
            success:false,
            message:"order not found with this id"
        })
    }
    else
    {
        res.status(200).json({
            success:true,
            Order
        })
    }

}

exports.getSingleOrders=async(req,res)=>{
    const Order=await order.findById(req.params.id).populate("user","name email");
    if(!Order)
    {
        res.status(400).json({
            success:false,
            message:"order not found with this id"
        })
    }
    else
    {
        res.status(200).json({
            success:true,
            Order
        })
    }
}

// get all Orders -- Admin
exports.getAllOrders = async (req, res) => {
    const Orders = await order.find();
  
    let totalAmount = 0;
  
    Orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });
  
    res.status(200).json({
      success: true,
      totalAmount,
      Orders,
    });
}
  
  // update Order Status -- Admin
  exports.updateOrder = async (req, res) => {
    const Order = await order.findById(req.params.id);
  
    if (!Order) {
      return res.status(404).json({
        success: false,
        message: "Order not found with this Id",
      });
    }
  
    if (Order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "You have already delivered this order",
      });
    }
  
    if (req.body.status === "Shipped") {
      for (const o of Order.orderItems) {
        const result = await updateStock(o.product, o.quantity, res);
        console.log("value of result"+result.success);
        if (!result.success) {
          // Handle the case where updating stock fails
          return res.status(500).json({
            success: false,
            message: "Failed to update stock for one or more products",
          });
        }
      }
    }
  
    Order.orderStatus = req.body.status;
  
    if (req.body.status === "Delivered") {
      Order.deliveredAt = Date.now();
    }
  
    await Order.save({ validateBeforeSave: false });
  
    return res.status(200).json({
      success: true,
      message: "Order Details updated successfully",
    });
  };
  
  async function updateStock(id, quantity, res) {
    try {
      const Product = await product.findById(id);
      console.log(Product);
      if (!Product) {
        console.log("here it is coming");
        return {
      
          success: false,
          message: "Product not found with this Id",
        };
      }
  console.log("value of quantity"+quantity);
  console.log("value of Product.Stock"+Product.Stock);
      Product.Stock -= quantity;
  
      const data=await Product.save({ validateBeforeSave: false });

      console.log("value of data"+data);
  
      return {
        success: true,
      };
    } catch (error) {
      console.log("value of shubh");
  
      console.error("value of error"+error.message);
  
      return {
        success: false,
        message: "API error occurred",
      };
    }
  }
  
  
  
  
  
  
  
  // delete Order -- Admin
  exports.deleteOrder = async (req, res, next) => {
    const Order = await order.findById(req.params.id);
  
    if (!Order) {
        res.status(404).json({
            success:false,
            message:"Order not found with this Id"
        });
    }
  
    else
    {
        await order.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message:"Order deleted successfully"
    });
}
  }