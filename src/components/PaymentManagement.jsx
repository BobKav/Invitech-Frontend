import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import api from '../services/api';
import config from '../config';

const stripePromise = loadStripe(config.STRIPE_PUBLIC_KEY);

const PaymentManagement = ({ eventId }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [stripeError, setStripeError] = useState(null);

  useEffect(() => {
    // Charger le script Stripe.js
    
    const simulateStripeCharge = async (amount, token) => {
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1000));
    
      // Simuler une réponse de Stripe
      return {
        id: 'ch_simulated' + Math.random().toString(36).substr(2, 9),
        amount: amount,
        currency: 'usd',
        status: 'succeeded',
      };
    };
    
    // Utilisation
    const charge = await simulateStripeCharge(1000, 'tok_simulated');

    const loadStripeScript = async () => {
      const stripe = await stripePromise;
      if (!stripe) {
        setStripeError("Impossible de charger Stripe.");
      }
    };
    loadStripeScript();
  }, []);

  const handleStripePayment = async () => {
    setIsProcessing(true);
    const stripe = await stripePromise;
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: document.querySelector('#card-element'),
    });

    if (error) {
      setStripeError(error.message);
      setIsProcessing(false);
      return;
    }

    try {
      const response = await api.post('/payments/stripe', { 
        amount, 
        paymentMethodId: paymentMethod.id 
      });
      setPaymentStatus({ success: true, message: 'Paiement par carte réussi' });
    } catch (error) {
      setPaymentStatus({ success: false, message: 'Erreur lors du paiement par carte' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalPayment = async (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          currency_code: "EUR",
          value: amount
        }
      }]
    });
  };

  const onPayPalApprove = async (data, actions) => {
    setIsProcessing(true);
    try {
      const details = await actions.order.capture();
      const response = await api.post('/payments/paypal', { 
        orderId: details.id,
        amount: amount
      });
      setPaymentStatus({ success: true, message: 'Paiement PayPal réussi' });
    } catch (error) {
      setPaymentStatus({ success: false, message: 'Erreur lors du paiement PayPal' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}>
      <div className="max-w-md mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Gestion des paiements</h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Montant (€)
            </label>
            <div className="relative">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0.00"
                required
              />
              <DollarSign className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Méthode de paiement
            </label>
            <div className="space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2">Carte de crédit</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2">PayPal</span>
              </label>
            </div>
          </div>
          {paymentMethod === 'card' && (
            <div id="card-element" className="mt-2">
              {/* Stripe Card Element will be inserted here */}
            </div>
          )}
          {paymentMethod === 'card' ? (
            <button
              type="button"
              onClick={handleStripePayment}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
              disabled={isProcessing}
            >
              {isProcessing ? (
                'Traitement en cours...'
              ) : (
                <>
                  <CreditCard className="inline-block mr-2 h-5 w-5" />
                  Payer par carte
                </>
              )}
            </button>
          ) : (
            <PayPalButtons
              createOrder={handlePayPalPayment}
              onApprove={onPayPalApprove}
              disabled={isProcessing}
            />
          )}
        </form>
        {stripeError && (
          <div className="mt-4 p-4 rounded-md bg-red-100 text-red-800">
            {stripeError}
          </div>
        )}
        {paymentStatus && (
          <div className={`mt-4 p-4 rounded-md ${paymentStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {paymentStatus.message}
          </div>
        )}
      </div>
    </PayPalScriptProvider>
  );
};

export default PaymentManagement;