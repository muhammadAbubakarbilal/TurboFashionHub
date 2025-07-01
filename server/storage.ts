import { 
  User, InsertUser, users, 
  Product, InsertProduct, products,
  Category, InsertCategory, categories,
  Collection, InsertCollection, collections,
  CarouselSlide, InsertCarouselSlide, carouselSlides,
  CartItem, InsertCartItem, cartItems,
  Newsletter, InsertNewsletter, newsletters,
  Promo, InsertPromo, promos
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  
  // Authentication checks
  isAdmin(userId: number): Promise<boolean>;

  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getNewArrivals(): Promise<Product[]>;
  getBestSellers(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Category methods
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Collection methods
  getCollections(): Promise<Collection[]>;
  getCollection(id: number): Promise<Collection | undefined>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  updateCollection(id: number, collectionData: Partial<InsertCollection>): Promise<Collection | undefined>;
  deleteCollection(id: number): Promise<boolean>;

  // Carousel methods
  getCarouselSlides(): Promise<CarouselSlide[]>;
  createCarouselSlide(slide: InsertCarouselSlide): Promise<CarouselSlide>;
  updateCarouselSlide(id: number, slideData: Partial<InsertCarouselSlide>): Promise<CarouselSlide | undefined>;
  deleteCarouselSlide(id: number): Promise<boolean>;

  // Cart methods
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;

  // Newsletter methods
  subscribeToNewsletter(email: string): Promise<Newsletter>;
  getNewsletterSubscribers(): Promise<Newsletter[]>;
  removeNewsletterSubscriber(id: number): Promise<boolean>;

  // Promo methods
  getPromos(): Promise<Promo[]>;
  createPromo(promo: InsertPromo): Promise<Promo>;
  updatePromo(id: number, promoData: Partial<InsertPromo>): Promise<Promo | undefined>;
  deletePromo(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private categories: Map<number, Category>;
  private collections: Map<number, Collection>;
  private carouselSlides: Map<number, CarouselSlide>;
  private cartItems: Map<number, CartItem>;
  private newsletters: Map<number, Newsletter>;
  private promos: Map<number, Promo>;
  
  private userIdCounter: number;
  private productIdCounter: number;
  private categoryIdCounter: number;
  private collectionIdCounter: number;
  private slideIdCounter: number;
  private cartItemIdCounter: number;
  private newsletterIdCounter: number;
  private promoIdCounter: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.collections = new Map();
    this.carouselSlides = new Map();
    this.cartItems = new Map();
    this.newsletters = new Map();
    this.promos = new Map();
    
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.categoryIdCounter = 1;
    this.collectionIdCounter = 1;
    this.slideIdCounter = 1;
    this.cartItemIdCounter = 1;
    this.newsletterIdCounter = 1;
    this.promoIdCounter = 1;
    
    // Initialize with some example data
    this.initializeData();
  }

  private initializeData() {
    // Initialize categories
    const categoryData: InsertCategory[] = [
      { name: "Women", imageUrl: "https://images.unsplash.com/photo-1564859228273-274232fdb516?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" },
      { name: "Men", imageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" },
      { name: "Accessories", imageUrl: "https://images.unsplash.com/photo-1556015048-4d3aa10df74c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" },
      { name: "Sale", imageUrl: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" }
    ];
    categoryData.forEach(category => this.createCategory(category));

    // Initialize products
    const productData: InsertProduct[] = [
      {
        name: "Modern Casual Jacket",
        description: "A comfortable and stylish jacket perfect for casual outings.",
        category: "Men",
        subcategory: "Men's Collection",
        price: 89.99,
        originalPrice: 119.99,
        imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        isNew: true,
        isBestSeller: false,
        isSale: true,
        rating: 4.5,
        ratingCount: 42
      },
      {
        name: "Elegant Summer Dress",
        description: "A light and airy dress perfect for summer days.",
        category: "Women",
        subcategory: "Women's Collection",
        price: 59.99,
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        isNew: true,
        isBestSeller: false,
        isSale: false,
        rating: 4.2,
        ratingCount: 28
      },
      {
        name: "Urban White Sneakers",
        description: "Clean, stylish sneakers for urban environments.",
        category: "Footwear",
        subcategory: "Footwear",
        price: 79.99,
        originalPrice: 99.99,
        imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        isNew: false,
        isBestSeller: false,
        isSale: true,
        rating: 4.7,
        ratingCount: 56
      },
      {
        name: "Designer Sunglasses",
        description: "Protect your eyes with style using our designer sunglasses.",
        category: "Accessories",
        subcategory: "Accessories",
        price: 49.99,
        originalPrice: 69.99,
        imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        isNew: false,
        isBestSeller: false,
        isSale: true,
        rating: 4.4,
        ratingCount: 31
      },
      {
        name: "Casual Wool Coat",
        description: "Stay warm and stylish with this casual wool coat.",
        category: "Women",
        subcategory: "Women's Outerwear",
        price: 149.99,
        imageUrl: "https://images.unsplash.com/photo-1583846717393-dc2412c95ed7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        isNew: false,
        isBestSeller: true,
        isSale: false,
        rating: 4.8,
        ratingCount: 124
      },
      {
        name: "Essential White Tee",
        description: "A wardrobe staple - the perfect white t-shirt.",
        category: "Basics",
        subcategory: "Basics",
        price: 29.99,
        imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        isNew: false,
        isBestSeller: true,
        isSale: false,
        rating: 5.0,
        ratingCount: 238
      },
      {
        name: "Leather Crossbody Bag",
        description: "A versatile leather crossbody bag for all occasions.",
        category: "Accessories",
        subcategory: "Accessories",
        price: 89.99,
        originalPrice: 109.99,
        imageUrl: "https://images.unsplash.com/photo-1550639525-c97d455acf70?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        isNew: false,
        isBestSeller: true,
        isSale: true,
        rating: 4.0,
        ratingCount: 97
      },
      {
        name: "Classic Sport Sneakers",
        description: "Comfortable and durable sneakers for sport activities.",
        category: "Footwear",
        subcategory: "Footwear",
        price: 119.99,
        imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        isNew: false,
        isBestSeller: true,
        isSale: false,
        rating: 4.5,
        ratingCount: 186
      }
    ];
    productData.forEach(product => this.createProduct(product));

    // Initialize carousel slides
    const carouselData: InsertCarouselSlide[] = [
      {
        title: "Summer Collection 2023",
        description: "Discover our latest styles perfect for the sunny days ahead.",
        imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        buttonText: "Shop Now",
        buttonLink: "/category/summer"
      },
      {
        title: "Autumn Essentials",
        description: "Layer up with our stylish selection of autumn pieces.",
        imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        buttonText: "Shop Now",
        buttonLink: "/category/autumn"
      },
      {
        title: "Winter Collection",
        description: "Stay warm and stylish with our winter collection.",
        imageUrl: "https://images.unsplash.com/photo-1459478309853-2c33a60058e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        buttonText: "Shop Now", 
        buttonLink: "/category/winter"
      }
    ];
    carouselData.forEach(slide => this.createCarouselSlide(slide));

    // Initialize collections
    const collectionData: InsertCollection[] = [
      {
        name: "Summer Vibes Collection",
        description: "Light fabrics, vibrant colors, and effortless style.",
        imageUrl: "https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
      }
    ];
    collectionData.forEach(collection => this.createCollection(collection));

    // Initialize promos
    const promoData: InsertPromo[] = [
      {
        title: "Accessories",
        description: "Complete your look with our premium collection",
        imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        buttonText: "Shop Now",
        buttonLink: "/category/accessories"
      },
      {
        title: "Up to 50% Off",
        description: "Limited time offer on selected items",
        imageUrl: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        buttonText: "Shop Sale",
        buttonLink: "/category/sale"
      }
    ];
    promoData.forEach(promo => this.createPromo(promo));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    // Set default values for nullable fields
    const newUser: User = { 
      ...user, 
      id,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      role: user.role || 'user',
      phone: user.phone || null,
      address: user.address || null,
      city: user.city || null,
      postalCode: user.postalCode || null
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async isAdmin(userId: number): Promise<boolean> {
    const user = await this.getUser(userId);
    return user?.role === 'admin';
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }

  async getNewArrivals(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isNew
    );
  }

  async getBestSellers(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isBestSeller
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    // Set default values for nullable fields
    const newProduct: Product = { 
      ...product, 
      id,
      originalPrice: product.originalPrice || null,
      isBestSeller: product.isBestSeller || false,
      isNew: product.isNew || false,
      isSale: product.isSale || false,
      rating: product.rating || 0,
      ratingCount: product.ratingCount || 0
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;

    const updatedCategory = { ...category, ...categoryData };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Collection methods
  async getCollections(): Promise<Collection[]> {
    return Array.from(this.collections.values());
  }

  async getCollection(id: number): Promise<Collection | undefined> {
    return this.collections.get(id);
  }

  async createCollection(collection: InsertCollection): Promise<Collection> {
    const id = this.collectionIdCounter++;
    const newCollection: Collection = { ...collection, id };
    this.collections.set(id, newCollection);
    return newCollection;
  }
  
  async updateCollection(id: number, collectionData: Partial<InsertCollection>): Promise<Collection | undefined> {
    const collection = this.collections.get(id);
    if (!collection) return undefined;

    const updatedCollection = { ...collection, ...collectionData };
    this.collections.set(id, updatedCollection);
    return updatedCollection;
  }

  async deleteCollection(id: number): Promise<boolean> {
    return this.collections.delete(id);
  }

  // Carousel methods
  async getCarouselSlides(): Promise<CarouselSlide[]> {
    return Array.from(this.carouselSlides.values());
  }

  async createCarouselSlide(slide: InsertCarouselSlide): Promise<CarouselSlide> {
    const id = this.slideIdCounter++;
    const newSlide: CarouselSlide = { ...slide, id };
    this.carouselSlides.set(id, newSlide);
    return newSlide;
  }
  
  async updateCarouselSlide(id: number, slideData: Partial<InsertCarouselSlide>): Promise<CarouselSlide | undefined> {
    const slide = this.carouselSlides.get(id);
    if (!slide) return undefined;

    const updatedSlide = { ...slide, ...slideData };
    this.carouselSlides.set(id, updatedSlide);
    return updatedSlide;
  }

  async deleteCarouselSlide(id: number): Promise<boolean> {
    return this.carouselSlides.delete(id);
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.sessionId === sessionId
    );
  }

  async addCartItem(item: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItems = Array.from(this.cartItems.values()).filter(
      (cartItem) => 
        cartItem.sessionId === item.sessionId && 
        cartItem.productId === item.productId
    );

    // Set default values
    const quantity = item.quantity || 1;
    const userId = item.userId || null;

    if (existingItems.length > 0) {
      const existingItem = existingItems[0];
      return this.updateCartItem(existingItem.id, existingItem.quantity + quantity) as Promise<CartItem>;
    }

    const id = this.cartItemIdCounter++;
    const newItem: CartItem = { 
      id, 
      sessionId: item.sessionId, 
      productId: item.productId, 
      userId,
      quantity 
    };
    this.cartItems.set(id, newItem);
    return newItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    if (quantity <= 0) {
      this.cartItems.delete(id);
      return undefined;
    }

    const updatedItem: CartItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  // Newsletter methods
  async subscribeToNewsletter(email: string): Promise<Newsletter> {
    // Check if email already exists
    const existingEmails = Array.from(this.newsletters.values()).filter(
      (newsletter) => newsletter.email === email
    );

    if (existingEmails.length > 0) {
      return existingEmails[0];
    }

    const id = this.newsletterIdCounter++;
    const newNewsletter: Newsletter = { id, email };
    this.newsletters.set(id, newNewsletter);
    return newNewsletter;
  }
  
  async getNewsletterSubscribers(): Promise<Newsletter[]> {
    return Array.from(this.newsletters.values());
  }
  
  async removeNewsletterSubscriber(id: number): Promise<boolean> {
    return this.newsletters.delete(id);
  }

  // Promo methods
  async getPromos(): Promise<Promo[]> {
    return Array.from(this.promos.values());
  }

  async createPromo(promo: InsertPromo): Promise<Promo> {
    const id = this.promoIdCounter++;
    const newPromo: Promo = { ...promo, id };
    this.promos.set(id, newPromo);
    return newPromo;
  }
  
  async updatePromo(id: number, promoData: Partial<InsertPromo>): Promise<Promo | undefined> {
    const promo = this.promos.get(id);
    if (!promo) return undefined;

    const updatedPromo = { ...promo, ...promoData };
    this.promos.set(id, updatedPromo);
    return updatedPromo;
  }
  
  async deletePromo(id: number): Promise<boolean> {
    return this.promos.delete(id);
  }
}

export const storage = new MemStorage();
