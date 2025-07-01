import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  Check, 
  Smartphone, 
  ChevronRight,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { apiRequest } from "@/lib/queryClient";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const CheckoutPage = () => {
  const [location, setLocation] = useLocation();
  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("easypaisa");
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Calculate subtotal, shipping, and total
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const shipping = subtotal > 5000 ? 0 : 500; // Free shipping over Rs. 5000
  const total = subtotal + shipping;

  useEffect(() => {
    // Redirect to home if cart is empty
    if (cartItems.length === 0) {
      setLocation("/");
    }
  }, [cartItems, setLocation]);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    const phoneRegex = /^03\d{9}$/; // Pakistan mobile format 03xxxxxxxxx
    
    if (!customerInfo.firstName) errors.firstName = "First name is required";
    if (!customerInfo.lastName) errors.lastName = "Last name is required";
    if (!customerInfo.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      errors.email = "Email is invalid";
    }
    
    if (!customerInfo.phone) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(customerInfo.phone)) {
      errors.phone = "Phone number should be in format 03xxxxxxxxx";
    }
    
    if (!customerInfo.address) errors.address = "Address is required";
    if (!customerInfo.city) errors.city = "City is required";
    if (!customerInfo.postalCode) errors.postalCode = "Postal code is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please check your information",
        description: "There are errors in your form that need to be fixed.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real app, this would call your backend to process the order
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating request
      
      // Simulate successful payment
      clearCart();
      setLocation("/order-success");
      
      toast({
        title: "Order successful!",
        description: `Your payment through ${paymentMethod === "easypaisa" ? "EasyPaisa" : "JazzCash"} has been processed.`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (cartItems.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center text-gray-600 hover:text-black"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shopping
        </Button>
        <h1 className="text-3xl font-bold mt-4">Checkout</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Information and Payment Method */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>
                  Please enter your details for delivery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName"
                      name="firstName"
                      value={customerInfo.firstName}
                      onChange={handleInputChange}
                      className={formErrors.firstName ? "border-red-500" : ""}
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-sm">{formErrors.firstName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName"
                      name="lastName"
                      value={customerInfo.lastName}
                      onChange={handleInputChange}
                      className={formErrors.lastName ? "border-red-500" : ""}
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-sm">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      className={formErrors.email ? "border-red-500" : ""}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm">{formErrors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone"
                      name="phone"
                      placeholder="03xxxxxxxxx"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className={formErrors.phone ? "border-red-500" : ""}
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-sm">{formErrors.phone}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Input 
                    id="address"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    className={formErrors.address ? "border-red-500" : ""}
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-sm">{formErrors.address}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city"
                      name="city"
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      className={formErrors.city ? "border-red-500" : ""}
                    />
                    {formErrors.city && (
                      <p className="text-red-500 text-sm">{formErrors.city}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input 
                      id="postalCode"
                      name="postalCode"
                      value={customerInfo.postalCode}
                      onChange={handleInputChange}
                      className={formErrors.postalCode ? "border-red-500" : ""}
                    />
                    {formErrors.postalCode && (
                      <p className="text-red-500 text-sm">{formErrors.postalCode}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Select your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="easypaisa" id="easypaisa" />
                    <Label htmlFor="easypaisa" className="flex items-center cursor-pointer">
                      <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center mr-4">
                        <Smartphone className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">EasyPaisa</p>
                        <p className="text-sm text-gray-500">Pay using your EasyPaisa account</p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="jazzcash" id="jazzcash" />
                    <Label htmlFor="jazzcash" className="flex items-center cursor-pointer">
                      <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center mr-4">
                        <Smartphone className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">JazzCash</p>
                        <p className="text-sm text-gray-500">Pay using your JazzCash account</p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center cursor-pointer">
                      <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center mr-4">
                        <CreditCard className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">Pay when you receive your order</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                
                {/* Payment instructions based on selected method */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  {paymentMethod === "easypaisa" && (
                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center">
                        <Smartphone className="mr-2 h-5 w-5 text-green-500" />
                        EasyPaisa Payment Instructions
                      </h3>
                      <ol className="list-decimal pl-5 space-y-1 text-sm">
                        <li>After placing the order, you'll receive a unique payment code</li>
                        <li>Open your EasyPaisa app and select "Send Money"</li>
                        <li>Enter the merchant account number that will be provided</li>
                        <li>Enter the payment amount: {formatPrice(total)}</li>
                        <li>Use the order number as reference</li>
                        <li>Once payment is confirmed, your order will be processed</li>
                      </ol>
                    </div>
                  )}
                  
                  {paymentMethod === "jazzcash" && (
                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center">
                        <Smartphone className="mr-2 h-5 w-5 text-red-500" />
                        JazzCash Payment Instructions
                      </h3>
                      <ol className="list-decimal pl-5 space-y-1 text-sm">
                        <li>After placing the order, you'll receive a unique payment code</li>
                        <li>Open your JazzCash app and select "Send Money"</li>
                        <li>Enter the merchant account number that will be provided</li>
                        <li>Enter the payment amount: {formatPrice(total)}</li>
                        <li>Use the order number as reference</li>
                        <li>Once payment is confirmed, your order will be processed</li>
                      </ol>
                    </div>
                  )}
                  
                  {paymentMethod === "cod" && (
                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center">
                        <AlertCircle className="mr-2 h-5 w-5 text-orange-500" />
                        Cash on Delivery Information
                      </h3>
                      <p className="text-sm">
                        You'll pay {formatPrice(total)} in cash when your order is delivered. 
                        Please have the exact amount ready to ensure a smooth delivery process.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit"
                className="w-full bg-[#FB923C] hover:bg-[#FDBA74] py-6 text-lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Complete Order <ChevronRight className="ml-2 h-5 w-5" />
                  </span>
                )}
              </Button>
            </motion.div>
          </form>
        </div>
        
        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-80 overflow-y-auto pr-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <img 
                      src={item.product?.imageUrl} 
                      alt={item.product?.name} 
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product?.name}</h4>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Quantity: {item.quantity}</span>
                        <span>{formatPrice((item.product?.price || 0) * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              
              {shipping === 0 && (
                <div className="bg-green-50 p-3 rounded-lg text-center text-sm flex items-center justify-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Your order qualifies for free shipping!</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;