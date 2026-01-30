import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_PRICES } from '@/lib/stripe';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { priceType = 'monthly', userId } = body;

        // Get the appropriate price ID
        const priceId = priceType === 'oneTime' ? STRIPE_PRICES.oneTime : STRIPE_PRICES.monthly;

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: priceType === 'oneTime' ? 'payment' : 'subscription',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
            metadata: {
                userId: userId || 'anonymous',
            },
        });

        return NextResponse.json({ url: session.url });

    } catch (error) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json(
            { error: '決済セッションの作成に失敗しました' },
            { status: 500 }
        );
    }
}
