import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Star, StarHalf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { Product } from '@shared/schema';

export default function ProductPage() {
  const [, params] = useRoute('/product/:id');
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${params?.id}`],
    queryFn: async () => {
      if (!params?.id) {
        throw new Error('No product ID provided');
      }
      const response = await fetch(`/api/products/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return response.json();
    },
    // Provide a default product object if no data is returned
    initialData: {
      id: 0,
      name: '',
      description: '',
      price: 0,
      category: '',
      imageUrl: '',
      rating: 0,
      ratingCount: 0,
      stock: 0,
    }
  });

  if (isLoading) {
    return <ProductPageSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">Error Loading Product</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating % 1 >= 0.5;

  const handleAddToCart = () => {
    // Add to cart logic
    toast({
      title: "Added to Cart",
      description: `${quantity} ${product.name}(s) added to cart`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      {/* Image section */}
      <div>
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-96 object-cover rounded-lg mb-4" 
        />
      </div>

      {/* Product details section */}
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-2xl font-semibold text-[#FB923C]">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
        
        {(product.rating > 0) && (
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(fullStars)].map((_, i) => (
                <Star key={i} className="fill-current" size={18} />
              ))}
              {hasHalfStar && <StarHalf className="fill-current" size={18} />}
            </div>
            <span className="text-sm text-gray-500">
              ({product.ratingCount || 0} reviews)
            </span>
          </div>
        )}
        
        <p className="text-gray-700 mb-8">{product.description}</p>
        
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex border border-gray-300 rounded-md">
            <button 
              className="px-3 py-2 border-r border-gray-300"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
            >
              -
            </button>
            <span className="px-4 py-2">{quantity}</span>
            <button 
              className="px-3 py-2 border-l border-gray-300"
              onClick={() => setQuantity(prev => prev + 1)}
            >
              +
            </button>
          </div>
          
          <Button 
            className="bg-[#FB923C] hover:bg-[#FDBA74] text-white px-6 py-2"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <div className="flex mb-2">
            <span className="font-medium w-24">Category:</span>
            <span>{product.category}</span>
          </div>
          {product.stock > 0 && (
            <div className="flex mb-2">
              <span className="font-medium w-24">Availability:</span>
              <span className="text-green-600">{product.stock} in stock</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Skeleton component for loading state
function ProductPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <Skeleton className="w-full h-96" />
      <div>
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
