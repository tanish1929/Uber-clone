import React, { useState, useEffect } from 'react'
import { loadStripe, CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js'
import axios from 'axios'
import './PaymentModal.css'

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_51234567890abcdefghijklmn'
)

// Inner component that uses Stripe hooks
const PaymentForm = ({ amount, rideId, userId, driverId, onSuccess, onCancel }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [clientSecret, setClientSecret] = useState(null)

  // Create payment intent
  useEffect(() => {
    if (amount && rideId && userId) {
      createPaymentIntent()
    }
  }, [amount, rideId, userId])

  const createPaymentIntent = async () => {
    try {
      const response = await axios.post('http://localhost:4000/payments/create-payment-intent', {
        amount,
        rideId,
        userId,
        driverId
      })
      setClientSecret(response.data.clientSecret)
    } catch (err) {
      console.error('Error creating payment intent:', err)
      setError('Failed to initialize payment. Please try again.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      setError('Payment system not ready. Please try again.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Confirm the payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            // You can add more details if needed
          }
        }
      })

      if (result.error) {
        setError(result.error.message)
        setIsLoading(false)
      } else if (result.paymentIntent.status === 'succeeded') {
        // Payment successful
        console.log('Payment successful:', result.paymentIntent.id)
        setIsLoading(false)
        onSuccess(result.paymentIntent)
      }
    } catch (err) {
      console.error('Payment error:', err)
      setError('Payment failed. Please try again.')
      setIsLoading(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h3 className="text-2xl font-bold mb-6 text-center">Complete Your Payment</h3>

      {/* Amount Display */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6 border-2 border-blue-200">
        <p className="text-gray-600 text-sm mb-1">Amount to Pay</p>
        <p className="text-3xl font-bold text-blue-600">₹{amount.toFixed(2)}</p>
      </div>

      {/* Card Details */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3 text-gray-700">
          Card Details
        </label>
        <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 font-semibold">❌ {error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || !stripe || !clientSecret}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⌛</span>
              Processing...
            </>
          ) : (
            `Pay ₹${amount.toFixed(2)}`
          )}
        </button>
      </div>

      {/* Security Notice */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>🔒 Your payment information is secure and encrypted</p>
        <p>Powered by Stripe</p>
      </div>
    </form>
  )
}

// Main Payment Modal Component
const PaymentModal = ({ isOpen, amount, rideId, userId, driverId, onSuccess, onCancel }) => {
  if (!isOpen) return null

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-modal-content">
          <Elements stripe={stripePromise}>
            <PaymentForm
              amount={amount}
              rideId={rideId}
              userId={userId}
              driverId={driverId}
              onSuccess={onSuccess}
              onCancel={onCancel}
            />
          </Elements>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
