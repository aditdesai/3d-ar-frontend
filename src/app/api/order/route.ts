import Razorpay from 'razorpay';
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request: NextRequest) {
    const { userId } = getAuth(request);
    
    if (!userId) {
        return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
        );
    }

    try {
        const { amount, currency = 'INR' } = (await request.json()) as {
            amount: string;
            currency?: string;
        };
        
        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            return NextResponse.json(
                { error: 'Invalid amount' },
                { status: 400 }
            );
        }

        const options = {
            amount: amount,
            currency: currency,
            receipt: 'rcp1',
        };

        const order = await razorpay.orders.create(options);
        console.log(order);
        return NextResponse.json({ orderId: order.id }, { status: 200 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}