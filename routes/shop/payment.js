const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const router = express.Router();
app.use(cors());
app.use(bodyParser.json());

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay Key ID
    key_secret: process.env.RAZORPAY_KEY_SECRET // Replace with your Razorpay Secret
});

router.post("/create-order", async (req, res) => {
    const { amount, currency } = req.body;
    console.log('req body :: ', req.body);

    try {
        const order = await razorpay.orders.create({
            amount: amount, // Amount in paise
            currency: currency,
            receipt: `receipt_${Date.now()}`,
        });
        
        res.json(order);
    } catch (error) {
        res.status(500).send("Error creating payment order");
    }
});

router.post("/verify-payment", (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const crypto = require("crypto");
    const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    if (generated_signature === razorpay_signature) {
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
});

module.exports = router;
