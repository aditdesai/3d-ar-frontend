import { Check } from "lucide-react"

const pricingPlans = [
  {
    name: "Basic",
    price: "₹50",
    originalPrice: null,
    features: ["5 image to 3D model conversions", "Basic support"],
    highlight: false,
  },
  {
    name: "Standard",
    price: "₹240",
    originalPrice: "₹250",
    features: ["25 image to 3D model conversions", "Standard support"],
    highlight: true,
  },
  {
    name: "Pro",
    price: "₹950",
    originalPrice: "₹1000",
    features: ["100 image to 3D model conversions", "Pro support", "API access"],
    highlight: false,
  },
]

export const PricingSection = () => {
  return (
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
              <button className="w-full py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors">
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
