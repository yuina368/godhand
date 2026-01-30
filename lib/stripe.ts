/**
 * Stripe Configuration
 */

import Stripe from 'stripe';

// Use placeholder values if environment variables are not set (for build time)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const premiumPriceId = process.env.STRIPE_PREMIUM_PRICE_ID || 'price_placeholder';
const onetimePriceId = process.env.STRIPE_ONETIME_PRICE_ID || 'price_placeholder';

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
    console.warn('Warning: STRIPE_SECRET_KEY is not set. Stripe functionality will not work.');
}

export const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
    typescript: true,
});

export const STRIPE_PREMIUM_PRICE_ID = premiumPriceId;
export const STRIPE_ONETIME_PRICE_ID = onetimePriceId;

// Stripe price configuration (fallback for testing)
export const STRIPE_PRICES = {
    monthly: STRIPE_PREMIUM_PRICE_ID || 'price_monthly',
    oneTime: STRIPE_ONETIME_PRICE_ID || 'price_onetime',
};
