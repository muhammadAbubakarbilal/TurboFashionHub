import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CarouselSlide } from "@shared/schema";

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesInView, setSlidesInView] = useState<number[]>([]);

  const { data: slides = [], isLoading } = useQuery<CarouselSlide[]>({
    queryKey: ['/api/carousel-slides'],
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
    setSlidesInView(emblaApi.slidesInView());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (isLoading) {
    return (
      <section className="relative overflow-hidden" aria-label="Featured Collections">
        <Skeleton className="w-full h-[500px] md:h-[600px]" />
      </section>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden" aria-label="Featured Collections">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <motion.div 
              className="min-w-0 flex-[0_0_100%] relative" 
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={slide.imageUrl} 
                alt={slide.title || 'Carousel slide'} 
                className="w-full h-[500px] md:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/70 to-transparent flex items-center">
                <div className="container mx-auto px-6 md:px-10">
                  <motion.div 
                    className="max-w-lg"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">{slide.title}</h1>
                    <p className="text-[#F8FAFC] text-lg mb-8">{slide.description}</p>
                    <div className="flex space-x-4">
                      <Button 
                        asChild
                        className="px-6 py-3 bg-[#FB923C] hover:bg-[#FDBA74] text-white font-semibold rounded-md transition-colors"
                      >
                        <Link href={slide.buttonLink || '/'}>{slide.buttonText || 'Shop Now'}</Link>
                      </Button>
                      <Button 
                        variant="outline"
                        className="px-6 py-3 bg-white hover:bg-[#E2E8F0] text-[#0F172A] font-semibold rounded-md transition-colors"
                      >
                        Learn More
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Carousel controls */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <motion.button 
            key={index}
            className={cn(
              "w-3 h-3 rounded-full bg-white transition-opacity",
              currentIndex === index ? "opacity-100" : "opacity-50"
            )}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => emblaApi?.scrollTo(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
      
      {/* Carousel navigation arrows */}
      <motion.button 
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-[#0F172A] hover:bg-white transition-colors"
        aria-label="Previous slide"
        onClick={scrollPrev}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft className="h-6 w-6" />
      </motion.button>
      <motion.button 
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-[#0F172A] hover:bg-white transition-colors"
        aria-label="Next slide"
        onClick={scrollNext}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight className="h-6 w-6" />
      </motion.button>
    </section>
  );
}
