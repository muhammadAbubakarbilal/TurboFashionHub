import { useState } from "react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Star, StarHalf } from "lucide-react";
import { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart.",
        variant: "destructive",
      });
    }
  };

  // Calculate whole stars and half stars
  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating % 1 >= 0.5;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-auto object-cover rounded-lg"
            />
            {product.isNew && (
              <div className="absolute top-3 left-3">
                <span className="bg-[#FB923C] text-white text-xs px-2 py-1 rounded">New</span>
              </div>
            )}
            {product.isSale && !product.isNew && (
              <div className="absolute top-3 left-3">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Sale</span>
              </div>
            )}
          </div>
          <div>
            <DialogTitle className="text-xl font-bold">{product.name}</DialogTitle>
            <DialogDescription className="text-[#64748B] mb-3">{product.subcategory}</DialogDescription>
            <div className="flex items-center mb-4">
              <span className="font-bold text-xl mr-3">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-[#64748B] line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            
            {(product.rating > 0) && (
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(fullStars)].map((_, i) => (
                    <Star key={i} className="fill-current" size={16} />
                  ))}
                  {hasHalfStar && <StarHalf className="fill-current" size={16} />}
                </div>
                <span className="text-sm text-[#64748B]">({product.ratingCount} reviews)</span>
              </div>
            )}
            
            <p className="text-[#0F172A] mb-6">{product.description}</p>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex border border-gray-300 rounded-md">
                <button 
                  className="px-3 py-1 border-r border-gray-300"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button 
                  className="px-3 py-1 border-l border-gray-300"
                  onClick={() => setQuantity(prev => prev + 1)}
                >
                  +
                </button>
              </div>
              
              <Button 
                className="bg-[#FB923C] hover:bg-[#FDBA74] text-white"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
            
            <Link 
              href={`/product/${product.id}`} 
              className="text-[#FB923C] hover:text-[#FDBA74] font-medium"
              onClick={onClose}
            >
              View Full Details →
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
