import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@shared/schema";
import { formatPrice } from "@/lib/utils";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { addToCart } = useCart();

  // Get all products
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Load favorites from localStorage
  useEffect(() => {
    const loadFavorites = () => {
      setIsLoading(true);
      try {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]') as number[];
        
        // Filter products to get only those in favorites
        if (products.length > 0) {
          const favoriteProducts = products.filter(product => 
            savedFavorites.includes(product.id)
          );
          setFavorites(favoriteProducts);
          setIsLoading(false);
        }
      } catch (e) {
        console.error('Error loading favorites:', e);
        setFavorites([]);
        setIsLoading(false);
      }
    };
    
    loadFavorites();
  }, [products]);

  // Handle removing a product from favorites
  const removeFromFavorites = (productId: number) => {
    try {
      // Get current favorites
      const currentFavorites = JSON.parse(localStorage.getItem('favorites') || '[]') as number[];
      
      // Remove the product ID
      const updatedFavorites = currentFavorites.filter(id => id !== productId);
      
      // Save back to localStorage
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      
      // Update state
      setFavorites(prev => prev.filter(product => product.id !== productId));
      
      // Dispatch event to update the favorites count in the header
      window.dispatchEvent(new Event('favoritesUpdated'));
      
      toast({
        title: "Removed from favorites",
        description: "Item has been removed from your favorites",
      });
    } catch (e) {
      console.error('Error removing from favorites:', e);
      toast({
        title: "Error",
        description: "Could not remove item from favorites",
        variant: "destructive",
      });
    }
  };

  // Handle adding to cart
  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1);
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Could not add item to cart",
        variant: "destructive",
      });
    }
  };

  // Clear all favorites
  const clearAllFavorites = () => {
    try {
      localStorage.setItem('favorites', '[]');
      setFavorites([]);
      window.dispatchEvent(new Event('favoritesUpdated'));
      toast({
        title: "Favorites cleared",
        description: "All items have been removed from your favorites",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Could not clear favorites",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <Button 
            variant="ghost" 
            className="mb-2 flex items-center text-gray-600 hover:text-black"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shopping
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">My Favorites</h1>
          <p className="text-gray-500 mt-1">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
        
        {favorites.length > 0 && (
          <Button 
            variant="outline" 
            className="flex items-center" 
            onClick={clearAllFavorites}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 h-80">
              <div className="w-full h-40 bg-gray-200 animate-pulse rounded-md mb-4" />
              <div className="h-4 bg-gray-200 animate-pulse rounded mb-2" />
              <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded mb-4" />
              <div className="h-6 w-1/3 bg-gray-200 animate-pulse rounded mb-2" />
              <div className="flex space-x-2 mt-4">
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-medium text-gray-700 mb-2">Your favorites list is empty</h2>
          <p className="text-gray-500 mb-6">Add items you love to your favorites. Save them for later!</p>
          <Button asChild>
            <Link href="/">
              Continue Shopping
            </Link>
          </Button>
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map(product => (
              <motion.div 
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="border rounded-lg overflow-hidden flex flex-col group"
              >
                <div className="relative overflow-hidden">
                  <Link href={`/product/${product.id}`}>
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  
                  <button 
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-red-500 hover:text-red-600 hover:bg-gray-100 transition"
                    onClick={() => removeFromFavorites(product.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <Link href={`/product/${product.id}`} className="hover:text-[#FB923C]">
                    <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                  </Link>
                  <p className="text-gray-500 text-sm mb-2">{product.subcategory}</p>
                  
                  <div className="flex items-baseline mt-auto">
                    <span className="text-lg font-bold">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="ml-2 text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 flex items-center justify-center"
                      asChild
                    >
                      <Link href={`/product/${product.id}`}>
                        View
                      </Link>
                    </Button>
                    <Button 
                      className="flex-1 flex items-center justify-center bg-[#FB923C] hover:bg-[#FDBA74]"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}