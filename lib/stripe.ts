/**
 * Stripe Configuration
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
    typescript: true,
});

export const PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID || '';

// Stripe price configuration (fallback for testing)
export const STRIPE_PRICES = {
    monthly: PREMIUM_PRICE_ID || 'price_monthly',
    oneTime: process.env.STRIPE_ONETIME_PRICE_ID || 'price_onetime',
};
