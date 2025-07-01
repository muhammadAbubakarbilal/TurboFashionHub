import { Link } from "wouter";
import { Promo } from "@shared/schema";

interface PromoSectionProps {
  promos: Promo[];
}

export default function PromoSection({ promos }: PromoSectionProps) {
  if (!promos || promos.length < 2) {
    return null;
  }

  // Display the first two promos
  const displayPromos = promos.slice(0, 2);

  return (
    <section className="py-16 bg-[#F8FAFC]" aria-label="Promotions">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayPromos.map((promo) => (
            <div key={promo.id} className="relative overflow-hidden rounded-lg">
              <img 
                src={promo.imageUrl} 
                alt={promo.title} 
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/60 to-transparent flex items-center">
                <div className="p-8">
                  <h3 className="text-white text-2xl font-bold mb-2">{promo.title}</h3>
                  <p className="text-white/90 mb-4">{promo.description}</p>
                  <Link 
                    href={promo.buttonLink} 
                    className={`inline-block ${promo.title.includes('50%') ? 'bg-[#FB923C] hover:bg-[#FDBA74] text-white' : 'bg-white hover:bg-[#E2E8F0] text-[#0F172A]'} font-medium px-4 py-2 rounded-md transition-colors`}
                  >
                    {promo.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
