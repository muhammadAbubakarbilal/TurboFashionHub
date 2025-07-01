import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Collection } from "@shared/schema";

interface CollectionBannerProps {
  collection: Collection;
}

export default function CollectionBanner({ collection }: CollectionBannerProps) {
  return (
    <section className="py-16 bg-[#F8FAFC]" aria-label="Featured Collection">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-lg">
          <img 
            src={collection.imageUrl} 
            alt={collection.name} 
            className="w-full h-96 md:h-[500px] object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-end">
            <div className="w-full md:w-1/2 p-8 md:p-16 text-right">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{collection.name}</h2>
              <p className="text-white/90 mb-8 text-lg">{collection.description}</p>
              <Button 
                asChild
                variant="secondary"
                className="inline-block px-6 py-3 bg-white hover:bg-[#E2E8F0] text-[#0F172A] font-semibold rounded-md transition-colors"
              >
                <Link href={`/category/${collection.name.toLowerCase().replace(/\s+/g, '-')}`}>Explore Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
