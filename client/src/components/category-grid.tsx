import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

// Define the Category type
interface Category {
  id: number;
  name: string;
  imageUrl: string;
}

export default function CategoryGrid() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    },
    // Provide a default empty array if no data is returned
    initialData: []
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Shop By Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="w-full h-60 md:h-80 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Shop By Category</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/category/${encodeURIComponent(category.name)}`}
            className="group relative overflow-hidden rounded-lg"
          >
            <img 
              src={category.imageUrl} 
              alt={`${category.name} category`}
              className="w-full h-60 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 to-transparent flex items-end p-4">
              <h3 className="text-white text-lg md:text-xl font-semibold">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
