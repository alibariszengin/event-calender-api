const nodemailer = require("nodemailer");

const sendEmail =async (mailOptions)=>{
    console.log("begin")
    let transporter = nodemailer.createTransport({

        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls: {
            rejectUnauthorized: false
          }

    });
    console.log("middle")
    transporter.verify().then(console.log("worked")).catch(console.error);
    
    let info =  await transporter.sendMail(mailOptions);
    console.log("end")
    console.log(`Message Send : ${info.messageId}`);
};

module.exports= sendEmail;