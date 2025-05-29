const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const cors = require("cors");
const twilio = require("twilio");
const port = 5000;

app.use(bodyparser.json());

app.use(cors());

// Twilio credentials

const accountSid = "AC39f838b5a0b8c9c091393dac9046afb4";
const authToken = "2ddd666f83a2e79de59a6240b6fdb7f0";
const client = new twilio(accountSid, authToken);
const otpstore = {};

//Send OTP
app.post("/sendotp", (req, res) => {
  const { phone } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000); //Generate 6 digit otp

  client.messages
    .create({
      body: `Your OTP is ${otp} Hello Pritish I luv U from Neha`,
      from: "+19594569636", // Replace with your Twilio phone number
      to: phone,
    })

    .then((message) => {
      console.log("message****", message);

      otpstore[phone] = otp;
      res.status(200).send({ success: true, otp });
    })
    .catch((error) => {
      res.status(500).send({ success: false, error: error.message });
    });
});

//verify otp

app.post("/verifyotp", (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res
      .status(404)
      .json({ message: "Phone number and OTP  are required" });
  }

  const storedOtp = otpstore[phone];

  if (parseInt(otp) == storedOtp) {
    delete otpstore[phone]; //Remove OTP after successful verification
    return res.json({ verified: true });
  } else {
    return res.json({ verified: false });
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
