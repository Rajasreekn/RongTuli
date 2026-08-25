require("dotenv").config();

const nodemailer = require("nodemailer");

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

(async () => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "RongTuli Test",
      text: "SMTP test successful!",
    });

    console.log("✅ Email sent successfully");
  } catch (err) {
    console.log("❌ Error:");
    console.log(err);
  }
})();