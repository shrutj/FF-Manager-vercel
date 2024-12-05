const Razorpay = require('razorpay');

// Initialize Razorpay instance with your credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Use the environment variable for Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Use the environment variable for Razorpay Key Secret
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { orderId, paymentId } = req.body;

    // Check if paymentId is provided
    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID not found for this order' });
    }

    try {
      // Make API call to Razorpay to initiate refund
      const refund = await razorpay.payments.refund(paymentId);

      if (refund && refund.status === 'captured') {
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
  } else {
    // Method Not Allowed for other HTTP methods
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
};
