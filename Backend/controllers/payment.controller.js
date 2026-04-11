const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_51234567890abcdefghijklmn')

// Create Payment Intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, rideId, userId, driverId } = req.body

    if (!amount || !rideId || !userId) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Amount in paise (smallest unit)
      currency: 'inr',
      metadata: {
        rideId,
        userId,
        driverId: driverId || 'unknown'
      }
    })

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })
  } catch (error) {
    console.error('Payment intent creation error:', error)
    res.status(500).json({ error: error.message })
  }
}

// Confirm Payment
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID required' })
    }

    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status === 'succeeded') {
      res.json({
        success: true,
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount / 100, // Convert back to rupees
        metadata: paymentIntent.metadata
      })
    } else {
      res.status(400).json({
        success: false,
        status: paymentIntent.status,
        message: 'Payment not completed'
      })
    }
  } catch (error) {
    console.error('Payment confirmation error:', error)
    res.status(500).json({ error: error.message })
  }
}

// Get Payment Details
exports.getPaymentDetails = async (req, res) => {
  try {
    const { paymentIntentId } = req.params

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID required' })
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    res.json({
      paymentId: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
      created: new Date(paymentIntent.created * 1000)
    })
  } catch (error) {
    console.error('Get payment details error:', error)
    res.status(500).json({ error: error.message })
  }
}

// Webhook handler for Stripe events
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature']
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret'

  let event

  try {
    event = stripe.webhooks.constructEvent(req.rawBody || req.body, sig, endpointSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return res.status(400).send(`Webhook Error: ${error.message}`)
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      console.log('Payment succeeded:', paymentIntent.id)
      // Update ride status in database if needed
      break

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object
      console.log('Payment failed:', failedPayment.id)
      // Handle payment failure
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.json({ received: true })
}
