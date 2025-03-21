'use client';

import { useState } from "react";
import { Check } from "lucide-react";
import Script from 'next/script';
import { useUser, SignedIn, SignedOut, useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Define types for our data structures
interface PricingPlan {
  name: string;
  price: string;
  rawPrice: number;
  originalPrice: string | null;
  features: string[];
  highlight: boolean;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}


const pricingPlans: PricingPlan[] = [
  {
    name: "Basic",
    price: "₹50",
    rawPrice: 50,
    originalPrice: null,
    features: ["5 image to 3D model conversions", "Basic support"],
    highlight: false,
  },
  {
    name: "Standard",
    price: "₹240",
    rawPrice: 240,
    originalPrice: "₹250",
    features: ["25 image to 3D model conversions", "Standard support"],
    highlight: true,
  },
  {
    name: "Pro",
    price: "₹950",
    rawPrice: 950,
    originalPrice: "₹1000",
    features: ["100 image to 3D model conversions", "Pro support", "API access"],
    highlight: false,
  },
];

export const PricingSection = () => {
  const { isLoaded: isUserLoaded, user } = useUser();
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChoosePlan = async (plan: PricingPlan) => {
    if (!isUserLoaded || !isAuthLoaded) {
      return; // Wait for auth to load
    }

    if (!isSignedIn) {
      // Open Clerk sign-in modal directly instead of redirecting
      openSignIn();
      return;
    }

    setLoading(true);
    
    try {
      const amount = plan.rawPrice;
      const orderId = await createOrderId(amount);
      
      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: 'INR',
        name: 'Image to 3D Conversion',
        description: `${plan.name} Plan Subscription`,
        order_id: orderId,
        handler: async function (response: any) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            plan: plan.name,
            userEmail: user?.primaryEmailAddress?.emailAddress,
          };
          
          const result = await fetch('/api/verify', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          const verificationResult = await result.json();
          
          if (verificationResult.isOk) {
            console.log(`Payment successful! You've purchased the ${plan.name} plan.`);
          } else {
            console.log(`Payment verification failed: ${verificationResult.message}`);
          }

          router.push('/');
          window.location.reload();
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.primaryEmailAddress?.emailAddress || '',
        },
        theme: {
          color: '#8B5CF6', // Purple color matching your UI
        },
      };
      
      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response: any) {
        alert(`Payment failed: ${response.error.description}`);
      });
      
      paymentObject.open();
    } catch (error: unknown) {
      console.error('Payment processing error:', error);
      alert(`Error processing payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const createOrderId = async (amount: number): Promise<string> => {
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Razorpay expects amount in paise
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      
      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      
      <section id="pricing" className="relative z-10 py-16 mt-10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Pricing Plans</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className='p-6 border rounded-lg shadow-lg bg-[hsl(var(--card))] card-highlight text-white transition-transform duration-300 hover:scale-105'
              >
                <div className="mb-4">
                  <h3 className="text-2xl font-semibold">{plan.name}</h3>
                  <div className="text-3xl font-bold mt-2">
                    {plan.originalPrice && (
                      <span className="line-through text-gray-400 mr-2 text-lg">{plan.originalPrice}</span>
                    )}
                    <span className="text-purple-400">{plan.price}</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-purple-400 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <SignedIn>
                  <button 
                    onClick={() => handleChoosePlan(plan)}
                    disabled={loading}
                    className="w-full py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing..." : "Choose Plan"}
                  </button>
                </SignedIn>
                
                <SignedOut>
                  <button 
                    onClick={() => openSignIn()}
                    className="w-full py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors"
                  >
                    Sign In to Purchase
                  </button>
                </SignedOut>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};