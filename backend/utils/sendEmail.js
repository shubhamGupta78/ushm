const nodeMailer=require('nodemailer');
const SMTPConnection = require('nodemailer/lib/smtp-connection');

exports.sendEmail=async(options)=>{
    console.log(options);
    const transporter=nodeMailer.createTransport({
        host:'smtp.gmail.com',
        port:465,
        service:'gmail',
        auth:{
            user:"shubhamgupta1999dkg@gmail.com",
            pass:"wctrudytuuswvdzm"
        }
    });

    const mailOptions={
        from:"shubhamgupta1999dkg@gmail.com",
        to:options.email,
        subject:options.subject,
        text:options.message

    };

    await transporter.sendMail(mailOptions);
}