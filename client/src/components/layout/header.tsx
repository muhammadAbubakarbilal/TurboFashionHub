import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  ShoppingBag, 
  User, 
  Search, 
  Menu,
  ChevronDown,
  Heart,
  LogOut,
  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchDialog from "@/components/search-dialog";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState<number>(0);
  const { cartItemCount } = useCart();

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Fetch favorites count from localStorage
  useEffect(() => {
    const fetchFavorites = () => {
      try {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavoritesCount(favorites.length);
      } catch (e) {
        setFavoritesCount(0);
      }
    };
    
    fetchFavorites();
    
    // Add event listener for storage changes
    window.addEventListener('storage', fetchFavorites);
    // Custom event for favorites update
    window.addEventListener('favoritesUpdated', fetchFavorites);
    
    return () => {
      window.removeEventListener('storage', fetchFavorites);
      window.removeEventListener('favoritesUpdated', fetchFavorites);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard shortcut for search (Ctrl+K or Command+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className={`bg-white ${isSticky ? 'shadow-sm' : ''} sticky top-0 z-50`}>
      {/* Top announcement bar */}
      <div className="bg-[#0F172A] text-white py-2 px-4 text-center text-sm">
        <p>Free shipping on all orders over ₹5000 | Use code WELCOME15 for 15% off your first order</p>
      </div>
      
      {/* Main navigation */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          8<span className="text-[#FB923C]">Bull</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <div className="relative group">
            <a href="#" className="font-medium hover:text-[#FB923C] transition-colors flex items-center">
              Women
              <ChevronDown className="h-4 w-4 ml-1" />
            </a>
            <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-[-10px]">
              <Link href="/category/new-arrivals" className="block px-4 py-2 hover:bg-[#E2E8F0] hover:text-[#FB923C]">New Arrivals</Link>
              <Link href="/category/Women" className="block px-4 py-2 hover:bg-[#E2E8F0] hover:text-[#FB923C]">Tops</Link>
              <Link href="/category/Women" className="block px-4 py-2 hover:bg-[#E2E8F0] hover:text-[#FB923C]">Dresses</Link>
              <Link href="/category/Women" className="block px-4 py-2 hover:bg-[#E2E8F0] hover:text-[#FB923C]">Bottoms</Link>
              <Link href="/category/Accessories" className="block px-4 py-2 hover:bg-[#E2E8F0] hover:text-[#FB923C]">Accessories</Link>
            </div>
          </div>
          
          <div className="relative group">
            <a href="#" className="font-medium hover:text-[#FB923C] transition-colors flex items-center">
              Men
              <ChevronDown className="h-4 w-4 ml-1" />
            </a>
            <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-[-10px]">
              <Link href="/category/new-arrivals" className="block px-4 py-2 hover:bg-[#E2E8F0] hover:text-[#FB923C]">New Arrivals</Link>
              <Link href="/category/Men" className="block px-4 py-2 hover:bg-[#E2E8F0] hover:text-[#FB923C]">Shirts</Link>
              <Link href="/category/Men" className="block px-4 py-2 hover:bg-[#E2E8F0] hover:text-[#FB923C]">Pants</Link>
              <Link href="/category/Men" className="block px-4 py-2 hover:bg-[#E2E8F0] hover:text-[#FB923C]">Outerwear</Link>
              <Link href="/category/Accessories" className="block px-4 py-2 hover:bg-[#E2E8F0] hover:text-[#FB923C]">Accessories</Link>
            </div>
          </div>
          
          <div className="relative group">
            <a href="#" className="font-medium hover:text-[#FB923C] transition-colors flex items-center">
              Collections
              <ChevronDown className="h-4 w-4 ml-1" />
            </a>
            <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-[-10px]">
              <Link href="/category/summer" className="block px-4 py-2 hover:bg-[#E2E8F0] hover:text-[#FB923C]">Summer 2023</Link>
              <Link href="/category/autumn" className="block px-4 py-2 hover:bg-[#E2E8F0] hover:text-[#FB923C]">Fall Essentials</Link>
              <Link href="/category/winter" className="block px-4 py-2 hover:bg-[#E2E8F0] hover:text-[#FB923C]">Winter Classics</Link>
              <Link href="/category/limited" className="block px-4 py-2 hover:bg-[#E2E8F0] hover:text-[#FB923C]">Limited Edition</Link>
            </div>
          </div>
          
          <Link href="/category/Sale" className="font-medium hover:text-[#FB923C] transition-colors">Sale</Link>
          <a href="#" className="font-medium hover:text-[#FB923C] transition-colors">About</a>
        </nav>
        
        {/* Search, Favorites, Account, Cart */}
        <div className="flex items-center space-x-4">
          <motion.button 
            className="text-[#0F172A] hover:text-[#FB923C] transition-colors"
            onClick={() => setIsSearchOpen(true)}
            whileTap={{ scale: 0.9 }}
          >
            <Search className="h-5 w-5" />
          </motion.button>
          
          <Link href="/favorites" className="text-[#0F172A] hover:text-[#FB923C] transition-colors relative">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Heart className="h-5 w-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FB923C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </motion.div>
          </Link>
          
          <UserMenu />
          
          <Sheet>
            <SheetTrigger asChild>
              <motion.button 
                className="text-[#0F172A] hover:text-[#FB923C] transition-colors relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FB923C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </motion.button>
            </SheetTrigger>
            <SheetContent>
              <CartSidebar />
            </SheetContent>
          </Sheet>
          
          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <motion.button 
                className="md:hidden text-[#0F172A] hover:text-[#FB923C]"
                whileTap={{ scale: 0.9 }}
              >
                <Menu className="h-6 w-6" />
              </motion.button>
            </SheetTrigger>
            <SheetContent side="left">
              <MobileMenu />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Search Dialog */}
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}

function CartSidebar() {
  const { cartItems, removeFromCart, updateCartQuantity } = useCart();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleQuantityChange = async (id: number, quantity: number) => {
    setUpdatingId(id);
    try {
      await updateCartQuantity(id, quantity);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (id: number) => {
    setUpdatingId(id);
    try {
      await removeFromCart(id);
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="h-full flex flex-col">
      <div className="py-4 border-b">
        <h2 className="text-xl font-bold">Your Cart</h2>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
            <p className="text-sm text-gray-400 mt-2">Add some products to get started</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-auto py-4">
            {cartItems.map((item) => (
              <motion.div 
                key={item.id} 
                className="flex items-start py-4 border-b"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={item.product?.imageUrl} 
                  alt={item.product?.name}
                  className="w-20 h-20 object-cover rounded-md mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.product?.name}</h3>
                  <p className="text-sm text-gray-500">
                    {item.product ? formatPrice(item.product.price) : ''}
                  </p>
                  
                  <div className="flex items-center mt-2">
                    <motion.button 
                      className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-md"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={updatingId === item.id}
                      whileTap={{ scale: 0.9 }}
                    >
                      -
                    </motion.button>
                    <span className="mx-2">{item.quantity}</span>
                    <motion.button 
                      className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-md"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={updatingId === item.id}
                      whileTap={{ scale: 0.9 }}
                    >
                      +
                    </motion.button>
                  </div>
                </div>
                <motion.button 
                  className="text-gray-500 hover:text-red-500"
                  onClick={() => handleRemove(item.id)}
                  disabled={updatingId === item.id}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </motion.button>
              </motion.div>
            ))}
          </div>
          
          <div className="py-4 border-t">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold">{formatPrice(totalPrice)}</span>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                className="w-full bg-[#FB923C] hover:bg-[#FDBA74]"
                onClick={() => {
                  window.location.href = '/checkout';
                }}
              >
                Proceed to Checkout
              </Button>
            </motion.div>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              Secure checkout with EasyPaisa, JazzCash & COD
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function MobileMenu() {
  return (
    <div className="py-4">
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      
      <nav className="space-y-6">
        <div>
          <h3 className="font-medium text-lg mb-2">Women</h3>
          <div className="space-y-2 pl-4">
            <Link href="/category/new-arrivals" className="block text-gray-600 hover:text-[#FB923C]">New Arrivals</Link>
            <Link href="/category/Women" className="block text-gray-600 hover:text-[#FB923C]">Tops</Link>
            <Link href="/category/Women" className="block text-gray-600 hover:text-[#FB923C]">Dresses</Link>
            <Link href="/category/Women" className="block text-gray-600 hover:text-[#FB923C]">Bottoms</Link>
            <Link href="/category/Accessories" className="block text-gray-600 hover:text-[#FB923C]">Accessories</Link>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-lg mb-2">Men</h3>
          <div className="space-y-2 pl-4">
            <Link href="/category/new-arrivals" className="block text-gray-600 hover:text-[#FB923C]">New Arrivals</Link>
            <Link href="/category/Men" className="block text-gray-600 hover:text-[#FB923C]">Shirts</Link>
            <Link href="/category/Men" className="block text-gray-600 hover:text-[#FB923C]">Pants</Link>
            <Link href="/category/Men" className="block text-gray-600 hover:text-[#FB923C]">Outerwear</Link>
            <Link href="/category/Accessories" className="block text-gray-600 hover:text-[#FB923C]">Accessories</Link>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-lg mb-2">Collections</h3>
          <div className="space-y-2 pl-4">
            <Link href="/category/summer" className="block text-gray-600 hover:text-[#FB923C]">Summer 2023</Link>
            <Link href="/category/autumn" className="block text-gray-600 hover:text-[#FB923C]">Fall Essentials</Link>
            <Link href="/category/winter" className="block text-gray-600 hover:text-[#FB923C]">Winter Classics</Link>
            <Link href="/category/limited" className="block text-gray-600 hover:text-[#FB923C]">Limited Edition</Link>
          </div>
        </div>
        
        <Link href="/category/Sale" className="block font-medium text-lg hover:text-[#FB923C]">Sale</Link>
        <a href="#" className="block font-medium text-lg hover:text-[#FB923C]">About</a>
      </nav>
    </div>
  );
}
