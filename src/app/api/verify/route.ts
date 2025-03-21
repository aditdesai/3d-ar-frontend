import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAuth } from '@clerk/nextjs/server';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from "../../firebase";

// Define the pricing plans with their credit values
type PricingPlan = {
  name: string;
  price: number;
  conversions?: number;
};

const pricingPlans: PricingPlan[] = [
  {
    name: "Basic",
    price: 50,
    conversions: 5
  },
  {
    name: "Standard",
    price: 240,
    conversions: 25
  },
  {
    name: "Pro",
    price: 950,
    conversions: 100
  },
];

const generatedSignature = (razorpayOrderId: string, razorpayPaymentId: string) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
        throw new Error(
            'Razorpay key secret is not defined in environment variables.'
        );
    }
    const sig = crypto
        .createHmac('sha256', keySecret)
        .update(razorpayOrderId + '|' + razorpayPaymentId)
        .digest('hex');
    return sig;
};

export async function POST(request: NextRequest) {
    const { userId } = getAuth(request);
    
    if (!userId) {
        return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
        );
    }
    
    try {
        const { 
            orderCreationId, 
            razorpayPaymentId, 
            razorpaySignature, 
            plan,
            userEmail // Make sure this is passed from the client
        } = await request.json();
        
        if (!orderCreationId || !razorpayPaymentId || !razorpaySignature || !plan || !userEmail) {
            return NextResponse.json(
                { message: 'Missing required payment parameters', isOk: false },
                { status: 400 }
            );
        }
        
        const signature = generatedSignature(orderCreationId, razorpayPaymentId);
        
        if (signature !== razorpaySignature) {
            console.warn(`Payment verification failed for user ${userId}, order ${orderCreationId}`);
            
            return NextResponse.json(
                { message: 'Payment verification failed', isOk: false },
                { status: 400 }
            );
        }
        
        // Find the selected plan to determine number of conversions
        const selectedPlan = pricingPlans.find(p => p.name === plan);
        
        if (!selectedPlan) {
            return NextResponse.json(
                { message: 'Invalid plan selected', isOk: false },
                { status: 400 }
            );
        }
        
        // Add credits to the user's account in Firestore
        const userRef = doc(db, "users", userEmail);
        
        // Check if user exists
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            // User exists, update generations_left
            await updateDoc(userRef, {
                generations_left: increment(selectedPlan.conversions || 0)
            });
        } else {
            // User does not exist in Firestore yet (this is unlikely if they're already authenticated)
            console.warn(`User ${userEmail} not found in Firestore while processing payment`);
            return NextResponse.json(
                { message: 'User not found', isOk: false },
                { status: 404 }
            );
        }
        
        // Log the successful transaction
        console.log(`Added ${selectedPlan.conversions} conversions to ${userEmail} for ${selectedPlan.name} plan`);
        
        return NextResponse.json(
            { 
                message: 'Payment verified successfully and credits added', 
                isOk: true,
                creditsAdded: selectedPlan.conversions
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json(
            { message: 'Server error during payment verification', isOk: false },
            { status: 500 }
        );
    }
}