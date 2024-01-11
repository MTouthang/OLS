import nodemailer from 'nodemailer';

const sendEmail = async function (email, subject, message) {
  // create reusable transport object using the default SMTP transport
  let transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // sendmail with the defined transport object
  await transport.sendMail({
    from: process.env.SMTP_FROM_EMAIL, // sender address
    to: email, // user email
    subject: subject, // subject line
    html: message, // html body
  });
};

export default sendEmail;
