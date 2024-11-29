const express = require('express');
const Razorpay = require('razorpay');
// const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
const port = 5001;

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3001' })); // Allow requests from React

// Initialize Razorpay instance with your credentials
const razorpay = new Razorpay({
  key_id: 'rzp_test_rq92ZJiAt5qXIY', // Replace with your Razorpay Key ID
  key_secret: 'JCxsedlvNRfN9hdMjVWWBrAH', // Replace with your Razorpay Key Secret
});

app.use(bodyParser.json());

// Refund Payment Endpoint
app.post('/api/refund-payment', async (req, res) => {
  const { orderId, paymentId } = req.body;
  console.log(req.body);
  
  if (!paymentId) {
    return res.status(400).json({ error: 'Payment ID not found for this order' });
  }

  try {
    // Make API call to Razorpay to initiate refund
    const refund = await razorpay.payments.refund(paymentId);

    if (refund && refund.status === 'processed') {
      // Refund successfully processed
      console.log(refund);
      return res.json({ success: true, refundDetails: refund });
    } else {
        console.log(refund);
      return res.status(400).json({ error: 'Refund failed', details: refund });
    }
  } catch (error) {
    console.error('Error refunding payment:', error);
    return res.status(500).json({ error: 'Error processing refund', details: error });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
