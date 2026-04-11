const express = require('express')
const router = express.Router()
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentDetails,
  handleWebhook
} = require('../controllers/payment.controller')

// Create payment intent
router.post('/create-payment-intent', createPaymentIntent)

// Confirm payment
router.post('/confirm-payment', confirmPayment)

// Get payment details
router.get('/payment-details/:paymentIntentId', getPaymentDetails)

// Webhook endpoint (usually doesn't require auth)
router.post('/webhook', handleWebhook)

module.exports = router
