import { useState } from "react";
import { Link } from "wouter";
import { Star, StarHalf, Heart } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@shared/schema";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  showRating?: boolean;
}

export default function ProductCard({ product, showRating = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  const { addToCart } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await addToCart(product.id, 1);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart.",
        variant: "destructive",
      });
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite 
        ? `${product.name} removed from your favorites.`
        : `${product.name} added to your favorites.`,
    });
  };

  // Calculate whole stars and half stars
  const rating = product.rating || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <motion.div 
      className="product-card bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-64 md:h-80 object-cover"
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
          {product.isBestSeller && !product.isNew && !product.isSale && (
            <div className="absolute top-3 left-3">
              <span className="bg-[#0F172A] text-white text-xs px-2 py-1 rounded">Best Seller</span>
            </div>
          )}
          
          {/* Favorite button */}
          <button 
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md z-10"
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              size={18} 
              className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'} transition-colors`} 
            />
          </button>

          {/* Add to Cart button that appears on hover */}
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0F172A] to-transparent p-4 transform transition-transform duration-300 ${
              isHovered ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            <Button 
              className="w-full bg-[#FB923C] hover:bg-[#FDBA74] text-white font-medium"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
          
          <div 
            className={`absolute inset-0 bg-[#0F172A]/40 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="secondary" 
                  className="bg-white text-[#0F172A] hover:bg-[#FB923C] hover:text-white font-medium px-4 py-2 rounded-md transition-colors"
                >
                  Quick View
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <QuickView product={product} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-sm md:text-base mb-1 truncate">{product.name}</h3>
          <p className="text-[#64748B] text-sm mb-2">{product.subcategory}</p>
          <div className="flex items-center">
            <span className="font-bold text-lg">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-[#64748B] line-through text-sm ml-2">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {showRating && rating > 0 && (
            <div className="flex items-center mt-2">
              <div className="flex text-yellow-400">
                {[...Array(fullStars)].map((_, i) => (
                  <Star key={i} className="fill-current" size={16} />
                ))}
                {hasHalfStar && <StarHalf className="fill-current" size={16} />}
              </div>
              <span className="text-xs text-[#64748B] ml-1">({product.ratingCount || 0})</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function QuickView({ product }: { product: Product }) {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart.",
        variant: "destructive",
      });
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite 
        ? `${product.name} removed from your favorites.`
        : `${product.name} added to your favorites.`,
    });
  };

  // Calculate whole stars and half stars
  const fullStars = Math.floor(product.rating || 0);
  const hasHalfStar = (product.rating || 0) % 1 >= 0.5;

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
        
        {/* Favorite button */}
        <button 
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md z-10"
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            size={18} 
            className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'} transition-colors`} 
          />
        </button>
      </div>
      <div>
        <h2 className="text-xl font-bold">{product.name}</h2>
        <p className="text-[#64748B] mb-3">{product.subcategory}</p>
        <div className="flex items-center mb-4">
          <span className="font-bold text-xl mr-3">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-[#64748B] line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        
        {(product.rating && product.rating > 0) && (
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(fullStars)].map((_, i) => (
                <Star key={i} className="fill-current" size={16} />
              ))}
              {hasHalfStar && <StarHalf className="fill-current" size={16} />}
            </div>
            <span className="text-sm text-[#64748B]">({product.ratingCount || 0} reviews)</span>
          </div>
        )}
        
        <p className="text-[#0F172A] mb-6">{product.description}</p>
        
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex border border-gray-300 rounded-md">
            <motion.button 
              className="px-3 py-1 border-r border-gray-300"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              whileTap={{ scale: 0.9 }}
            >
              -
            </motion.button>
            <span className="px-4 py-1">{quantity}</span>
            <motion.button 
              className="px-3 py-1 border-l border-gray-300"
              onClick={() => setQuantity(prev => prev + 1)}
              whileTap={{ scale: 0.9 }}
            >
              +
            </motion.button>
          </div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              className="bg-[#FB923C] hover:bg-[#FDBA74] text-white"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </motion.div>
        </div>
        
        <Link 
          href={`/product/${product.id}`} 
          className="text-[#FB923C] hover:text-[#FDBA74] font-medium flex items-center"
        >
          View Full Details 
          <motion.span 
            animate={{ x: [0, 5, 0] }} 
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="ml-1"
          >
            →
          </motion.span>
        </Link>
      </div>
    </motion.div>
  );
}
