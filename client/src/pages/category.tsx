import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import ProductGrid from "@/components/product-grid";

export default function Category() {
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category);
  
  const { data: products, isLoading } = useQuery({
    queryKey: [`/api/products/category/${decodedCategory}`],
  });

  // Map special category paths to their corresponding API endpoints
  let title = decodedCategory;
  let apiUrl = `/api/products/category/${decodedCategory}`;
  
  if (decodedCategory === 'new-arrivals') {
    title = 'New Arrivals';
    apiUrl = '/api/products/new-arrivals';
  } else if (decodedCategory === 'best-sellers') {
    title = 'Best Sellers';
    apiUrl = '/api/products/best-sellers';
  }

  // Use the appropriate API endpoint based on the category
  const { data: specialProducts, isLoading: isLoadingSpecial } = useQuery({
    queryKey: [apiUrl],
    enabled: ['new-arrivals', 'best-sellers'].includes(decodedCategory),
  });

  // Determine which products to display
  const displayProducts = ['new-arrivals', 'best-sellers'].includes(decodedCategory) 
    ? specialProducts 
    : products;
  
  const isLoadingProducts = ['new-arrivals', 'best-sellers'].includes(decodedCategory)
    ? isLoadingSpecial
    : isLoading;

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 capitalize">{title}</h1>
      
      {isLoadingProducts ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <Skeleton className="w-full h-64 md:h-80" />
              <div className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-6 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : displayProducts && displayProducts.length > 0 ? (
        <ProductGrid products={displayProducts} showRating={true} />
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-gray-500">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}
