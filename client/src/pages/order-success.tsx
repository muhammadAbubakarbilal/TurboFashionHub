import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle, ShoppingBag, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

export default function OrderSuccessPage() {
  const [_, setLocation] = useLocation();

  // Trigger confetti effect when the page loads
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    
    const runConfetti = () => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) return;
      
      const particleCount = 50 * (timeLeft / duration);
      
      // Create confetti with random colors
      confetti({
        particleCount: Math.floor(particleCount),
        spread: 70,
        origin: { y: 0.6 }
      });
      
      requestAnimationFrame(runConfetti);
    };
    
    requestAnimationFrame(runConfetti);
    
    // Generate confetti from both sides one time
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 500);
    
    return () => {
      // Clean up (although confetti should end by itself)
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 min-h-[80vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        className="mb-6 text-green-500"
      >
        <CheckCircle className="h-24 w-24" strokeWidth={1.5} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center max-w-lg"
      >
        <h1 className="text-3xl font-bold mb-3">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for shopping with 8Bull. Your order has been received and is being processed.
          You will receive a confirmation email with your order details shortly.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-medium mb-4">What's Next?</h2>
          <ul className="space-y-3 text-left">
            <li className="flex items-start">
              <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <span className="font-medium">Order Confirmation</span>
                <p className="text-sm text-gray-500">
                  You'll receive an email confirmation with your order details
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <span className="font-medium">Order Processing</span>
                <p className="text-sm text-gray-500">
                  We'll prepare your items for shipping
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-purple-100 rounded-full p-1 mr-3 mt-0.5">
                <CheckCircle className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <span className="font-medium">Shipping</span>
                <p className="text-sm text-gray-500">
                  Your order will be shipped within 1-2 business days
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-orange-100 rounded-full p-1 mr-3 mt-0.5">
                <CheckCircle className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <span className="font-medium">Delivery</span>
                <p className="text-sm text-gray-500">
                  Estimated delivery time: 3-5 business days
                </p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center"
              onClick={() => setLocation("/")}
            >
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              className="w-full bg-[#FB923C] hover:bg-[#FDBA74] flex items-center justify-center"
              onClick={() => setLocation("/products")}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}