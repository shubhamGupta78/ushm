const stripe=require('stripe')('sk_test_51Np7YkSBh8c4DAFyQVPJoBvxE07CUObsJSAk1VqCZ7IXjLvHRi7HD7Lgyt7kilFKrY3yHKhN9xEgflHfB4Suz0Oy00tbcWoNXV');

exports.processPayments=async(req,res)=>{
    // const myPayments=stripe.paymentIntents.create({
    //     amount:req.body.amount,
    //     currency:"inr",
    //     metadata:{
    //         company:"USHMO",

    //     }
    // });
//console.log("paymentecefc"+myPayments.client_secret);
stripe.paymentIntents.create({
    amount: req.body.amount, // The amount in the smallest currency unit (e.g., cents)
    currency: 'inr', // The currency code (e.g., 'inr' for Indian Rupees)
    metadata: {
      company: 'USHMO', // Metadata associated with the Payment Intent
    },
  })
    .then(paymentIntent => {
      // Handle the successful creation of the Payment Intent
      res.status(200).json({
        success:true,
        client_secret:paymentIntent.client_secret
  
    });
      // You can send a response or perform other actions here
    })
    .catch(error => {
      // Handle any errors that occur during the creation of the Payment Intent
   
      // You should send an error response or perform error handling here
    });
    
}

exports.sendStripeApiKey=async(req,res)=>{
    const val='pk_test_51Np7YkSBh8c4DAFy3LvpEYp5OUygOikknYwYcae1Jps82PSqqyNBHUgO3fCxu2YYdmi2TUNUUb1FJCzTKQ5sOCzp00aZvhv6rU'
    res.status(200).json({
        stripeApiKey:val
    });
}