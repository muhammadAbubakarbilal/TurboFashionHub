import ProductCard from "./product-card";
import { Product } from "@shared/schema";

interface ProductGridProps {
  products: Product[];
  showRating?: boolean;
}

export default function ProductGrid({ products, showRating = false }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          showRating={showRating}
        />
      ))}
    </div>
  );
}
