import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;

            // Get user ID from metadata
            const userId = session.metadata?.userId || 'anonymous';

            // Update user to premium
            let user = await db.users.findById(userId);

            if (!user) {
                user = await db.users.create({
                    id: userId,
                    isPremium: true,
                    stripeCustomerId: session.customer as string,
                });
            } else {
                await db.users.update(userId, {
                    isPremium: true,
                    stripeCustomerId: session.customer as string,
                });
            }

            console.log('✅ User upgraded to premium:', userId);
            break;
        }

        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;

            // Find user by customer ID and downgrade
            const user = await db.users.findByStripeCustomerId(customerId);
            if (user) {
                await db.users.update(user.id, { isPremium: false });
                console.log('⚠️ User subscription cancelled:', user.id);
            }
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
