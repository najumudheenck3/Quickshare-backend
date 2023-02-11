import * as dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'

const sendEmail = async (email:string, subject:string, text:string) => {
  console.log("11111");
  
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 465,
      secure: true,
      auth: {
        user: 'quickqwerty1239@gmail.com',
        pass: 'ayngqbppdbeuichx',
      },
    });
    console.log("4444");
    

    await transporter.sendMail({
      from: 'quickqwerty1239@gmail.com',
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

export default sendEmail