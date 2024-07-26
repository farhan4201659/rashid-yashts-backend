import nodemailer from "nodemailer";
import { callRequestTemplate } from "./emailtemplates.js";

export const sendEmail = async (name , subject ,  number , msg) => {

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });


  const info = await transporter.sendMail({
    from: `${process.env.SMTP_SENDNAME} " <${process.env.SMTP_USER}>`, // sender address
    to: "emailstormfacts@gmail.com" || "emailstormfacts@gmail.com", // list of receivers
    subject: subject || "Hello ✔", // Subject line
    html: callRequestTemplate(name || "Haider" , subject || "http://localhost:5000/" , number , msg), // html body
  });

  console.log(info.messageId);
}