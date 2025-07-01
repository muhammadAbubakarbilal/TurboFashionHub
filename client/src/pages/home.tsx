import { useQuery } from "@tanstack/react-query";
import HeroCarousel from "@/components/hero-carousel";
import CategoryGrid from "@/components/category-grid";
import ProductGrid from "@/components/product-grid";
import CollectionBanner from "@/components/collection-banner";
import PromoSection from "@/components/promo-section";
import NewsletterSection from "@/components/newsletter-section";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: newArrivals, isLoading: loadingNewArrivals } = useQuery({
    queryKey: ['/api/products/new-arrivals'],
  });

  const { data: bestSellers, isLoading: loadingBestSellers } = useQuery({
    queryKey: ['/api/products/best-sellers'],
  });

  const { data: collections, isLoading: loadingCollections } = useQuery({
    queryKey: ['/api/collections'],
  });

  const { data: promos, isLoading: loadingPromos } = useQuery({
    queryKey: ['/api/promos'],
  });

  return (
    <div>
      <HeroCarousel />
      
      <section className="py-16 bg-[#F8FAFC]" aria-label="Featured Categories">
        <CategoryGrid />
      </section>
      
      <section className="py-16 bg-white" aria-label="New Arrivals">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">New Arrivals</h2>
            <a href="/category/new" className="text-[#FB923C] hover:text-[#FDBA74] font-medium flex items-center transition-colors">
              View All <span className="ml-1">→</span>
            </a>
          </div>
          
          {loadingNewArrivals ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
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
          ) : (
            <ProductGrid products={newArrivals || []} />
          )}
        </div>
      </section>
      
      {loadingCollections ? (
        <section className="py-16 bg-[#F8FAFC]">
          <div className="container mx-auto px-4">
            <Skeleton className="w-full h-96 md:h-[500px] rounded-lg" />
          </div>
        </section>
      ) : collections && collections.length > 0 ? (
        <CollectionBanner collection={collections[0]} />
      ) : null}
      
      <section className="py-16 bg-white" aria-label="Best Sellers">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">Best Sellers</h2>
            <a href="/category/best-sellers" className="text-[#FB923C] hover:text-[#FDBA74] font-medium flex items-center transition-colors">
              View All <span className="ml-1">→</span>
            </a>
          </div>
          
          {loadingBestSellers ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <Skeleton className="w-full h-64 md:h-80" />
                  <div className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-1/3 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={bestSellers || []} showRating={true} />
          )}
        </div>
      </section>
      
      {loadingPromos ? (
        <section className="py-16 bg-[#F8FAFC]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="w-full h-80 rounded-lg" />
              <Skeleton className="w-full h-80 rounded-lg" />
            </div>
          </div>
        </section>
      ) : promos && promos.length > 0 ? (
        <PromoSection promos={promos} />
      ) : null}
      
      <NewsletterSection />
    </div>
  );
}
