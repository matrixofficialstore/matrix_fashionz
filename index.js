const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

/*
  IMPORTANT:
  Keep this file PRIVATE.
  Never upload this publicly with your real password.
*/

const EMAIL_USER = "matrixofficialhub@gmail.com";
const EMAIL_PASS = "pxzd eoob xgup fyxa";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

app.post("/order", async (req, res) => {
  try {

    const {
      name,
      email,
      phone,
      address,
      paymentMethod,
      cart
    } = req.body;

    const items = cart.map(item => item.name).join(", ");

    const total = cart.length * 499;

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Order Under Review",

      html: `
        <div style="
          background:#000;
          padding:40px;
          font-family:Arial;
          color:white;
          text-align:center;
        ">

          <div style="
            max-width:600px;
            margin:auto;
            background:#111;
            padding:30px;
            border-radius:15px;
            border:2px solid white;
          ">

            <h1 style="color:white;">
              Matrix Official Hub
            </h1>

            <h2 style="color:white;">
              Your order is under reviewing.
            </h2>

            <p style="
              font-size:18px;
              color:#cccccc;
            ">
              When it's done your order will be placed.
            </p>

            <hr style="
              margin:25px 0;
              border-color:#333;
            ">

            <p><strong>Name:</strong> ${name}</p>

            <p><strong>Phone:</strong> ${phone}</p>

            <p><strong>Address:</strong> ${address}</p>

            <p><strong>Payment Method:</strong> ${paymentMethod}</p>

            <p><strong>Items:</strong> ${items}</p>

            <p><strong>Total:</strong> ${total}৳</p>

            <div style="
              margin-top:30px;
              color:#999;
            ">
              Thank you for shopping with us.
            </div>

          </div>

        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Order placed successfully! Email sent."
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong."
    });

  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});