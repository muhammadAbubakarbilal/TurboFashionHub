import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@shared/schema";
import { formatPrice } from "@/lib/utils";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [_, setLocation] = useLocation();
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    enabled: isOpen, // Only fetch when dialog is open
  });

  // Reset search query when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Handle search
  useEffect(() => {
    if (!isOpen || searchQuery.length <= 1) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    // Simulating search delay
    const timer = setTimeout(() => {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        product.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, products, isOpen]);

  // Handle keyboard shortcut (Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Prevent scrolling when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  const handleProductClick = (productId: number) => {
    onClose();
    setLocation(`/product/${productId}`);
  };

  const handleCategoryClick = (category: string) => {
    onClose();
    setLocation(`/category/${encodeURIComponent(category)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto">
      <motion.div 
        className="bg-white w-full max-w-3xl mt-20 rounded-lg shadow-xl max-h-[70vh] overflow-hidden flex flex-col"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4 border-b sticky top-0 bg-white z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              type="text"
              placeholder="Search for products, categories, etc..."
              className="pl-10 pr-10 py-3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#FB923C] border-r-transparent"></div>
              <p className="mt-2 text-gray-500">Searching...</p>
            </div>
          ) : searchQuery.length > 1 ? (
            searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map(product => (
                  <motion.div 
                    key={product.id}
                    className="flex border rounded-lg overflow-hidden cursor-pointer hover:border-[#FB923C] transition-colors"
                    onClick={() => handleProductClick(product.id)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-24 h-24 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="font-medium text-sm">{product.name}</h3>
                      <p className="text-gray-500 text-xs mb-1">{product.subcategory}</p>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-gray-400 line-through text-xs">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500">No results found for "{searchQuery}"</p>
                <p className="text-sm text-gray-400 mt-1">Try different keywords or browse categories below</p>
              </div>
            )
          ) : (
            <div>
              <h3 className="font-medium mb-3">Popular Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Women", "Men", "Accessories", "Sale"].map(category => (
                  <motion.div
                    key={category}
                    className="bg-gray-100 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleCategoryClick(category)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <p className="font-medium">{category}</p>
                  </motion.div>
                ))}
              </div>
              
              <h3 className="font-medium mt-6 mb-3">Trending Searches</h3>
              <div className="flex flex-wrap gap-2">
                {["Summer dress", "Casual shirts", "Denim", "Jackets"].map(term => (
                  <motion.span
                    key={term}
                    className="bg-gray-100 rounded-full px-3 py-1 text-sm cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => setSearchQuery(term)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {term}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t sticky bottom-0 bg-white">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </motion.div>
    </div>
  );
}