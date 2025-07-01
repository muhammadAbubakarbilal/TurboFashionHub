import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertProductSchema, 
  insertCategorySchema, 
  insertCarouselSlideSchema, 
  insertCollectionSchema,
  insertNewsletterSchema,
  insertCartItemSchema,
  insertPromoSchema
} from "@shared/schema";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
  // Admin middleware
  const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden. Admin access required." });
    }
    
    next();
  };
  
  // API Routes - prefix all routes with /api

  // Products
  app.get("/api/products", async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/new-arrivals", async (req, res) => {
    const newArrivals = await storage.getNewArrivals();
    res.json(newArrivals);
  });

  app.get("/api/products/best-sellers", async (req, res) => {
    const bestSellers = await storage.getBestSellers();
    res.json(bestSellers);
  });

  app.get("/api/products/category/:category", async (req, res) => {
    const { category } = req.params;
    const products = await storage.getProductsByCategory(category);
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    
    const product = await storage.getProduct(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(product);
  });

  app.post("/api/products", isAdmin, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data", error });
    }
  });
  
  app.put("/api/products/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const validatedData = insertProductSchema.partial().parse(req.body);
      const updatedProduct = await storage.updateProduct(id, validatedData);
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data", error });
    }
  });
  
  app.delete("/api/products/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting product", error });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get("/api/categories/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    
    const category = await storage.getCategory(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json(category);
  });

  app.post("/api/categories", isAdmin, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data", error });
    }
  });
  
  app.put("/api/categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      const validatedData = insertCategorySchema.partial().parse(req.body);
      const updatedCategory = await storage.updateCategory(id, validatedData);
      res.json(updatedCategory);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data", error });
    }
  });
  
  app.delete("/api/categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const success = await storage.deleteCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting category", error });
    }
  });

  // Collections
  app.get("/api/collections", async (req, res) => {
    const collections = await storage.getCollections();
    res.json(collections);
  });

  app.get("/api/collections/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid collection ID" });
    }
    
    const collection = await storage.getCollection(id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    
    res.json(collection);
  });

  app.post("/api/collections", isAdmin, async (req, res) => {
    try {
      const validatedData = insertCollectionSchema.parse(req.body);
      const collection = await storage.createCollection(validatedData);
      res.status(201).json(collection);
    } catch (error) {
      res.status(400).json({ message: "Invalid collection data", error });
    }
  });
  
  app.put("/api/collections/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid collection ID" });
      }
      
      const collection = await storage.getCollection(id);
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }
      
      const validatedData = insertCollectionSchema.partial().parse(req.body);
      const updatedCollection = await storage.updateCollection(id, validatedData);
      res.json(updatedCollection);
    } catch (error) {
      res.status(400).json({ message: "Invalid collection data", error });
    }
  });
  
  app.delete("/api/collections/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid collection ID" });
      }
      
      const success = await storage.deleteCollection(id);
      if (!success) {
        return res.status(404).json({ message: "Collection not found" });
      }
      
      res.json({ message: "Collection deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting collection", error });
    }
  });

  // Carousel slides
  app.get("/api/carousel-slides", async (req, res) => {
    const slides = await storage.getCarouselSlides();
    res.json(slides);
  });

  app.post("/api/carousel-slides", isAdmin, async (req, res) => {
    try {
      const validatedData = insertCarouselSlideSchema.parse(req.body);
      const slide = await storage.createCarouselSlide(validatedData);
      res.status(201).json(slide);
    } catch (error) {
      res.status(400).json({ message: "Invalid carousel slide data", error });
    }
  });
  
  app.put("/api/carousel-slides/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid carousel slide ID" });
      }
      
      const slide = await storage.getCarouselSlides().then(slides => 
        slides.find(s => s.id === id)
      );
      if (!slide) {
        return res.status(404).json({ message: "Carousel slide not found" });
      }
      
      const validatedData = insertCarouselSlideSchema.partial().parse(req.body);
      const updatedSlide = await storage.updateCarouselSlide(id, validatedData);
      res.json(updatedSlide);
    } catch (error) {
      res.status(400).json({ message: "Invalid carousel slide data", error });
    }
  });
  
  app.delete("/api/carousel-slides/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid carousel slide ID" });
      }
      
      const success = await storage.deleteCarouselSlide(id);
      if (!success) {
        return res.status(404).json({ message: "Carousel slide not found" });
      }
      
      res.json({ message: "Carousel slide deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting carousel slide", error });
    }
  });

  // Cart
  app.get("/api/cart", async (req, res) => {
    // In a real app, you'd use a real session ID
    const sessionId = req.headers["session-id"] as string || "guest-session";
    const cartItems = await storage.getCartItems(sessionId);
    
    // Fetch complete product info for each cart item
    const cartWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const product = await storage.getProduct(item.productId);
        return {
          ...item,
          product
        };
      })
    );
    
    res.json(cartWithProducts);
  });

  app.post("/api/cart", async (req, res) => {
    try {
      // In a real app, you'd use a real session ID
      const sessionId = req.headers["session-id"] as string || "guest-session";
      
      const schema = insertCartItemSchema.extend({
        productId: z.number(),
        quantity: z.number().min(1)
      });
      
      const validatedData = schema.parse({
        ...req.body,
        sessionId
      });
      
      const cartItem = await storage.addCartItem(validatedData);
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid cart item data", error });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }
      
      const schema = z.object({
        quantity: z.number().min(0)
      });
      
      const { quantity } = schema.parse(req.body);
      const updatedItem = await storage.updateCartItem(id, quantity);
      
      if (!updatedItem) {
        return res.status(200).json({ message: "Item removed from cart" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid data", error });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid cart item ID" });
    }
    
    const success = await storage.removeCartItem(id);
    if (!success) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    
    res.json({ message: "Item removed from cart" });
  });

  // Newsletter
  app.post("/api/newsletter", async (req, res) => {
    try {
      const validatedData = insertNewsletterSchema.parse(req.body);
      const newsletter = await storage.subscribeToNewsletter(validatedData.email);
      res.status(201).json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      res.status(400).json({ message: "Invalid email", error });
    }
  });

  // Newsletter administration (admin only)
  app.get("/api/newsletter/subscribers", isAdmin, async (req, res) => {
    try {
      const subscribers = await storage.getNewsletterSubscribers();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching newsletter subscribers", error });
    }
  });
  
  app.delete("/api/newsletter/subscribers/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid subscriber ID" });
      }
      
      const success = await storage.removeNewsletterSubscriber(id);
      if (!success) {
        return res.status(404).json({ message: "Subscriber not found" });
      }
      
      res.json({ message: "Subscriber removed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error removing subscriber", error });
    }
  });

  // Promos
  app.get("/api/promos", async (req, res) => {
    const promos = await storage.getPromos();
    res.json(promos);
  });
  
  app.post("/api/promos", isAdmin, async (req, res) => {
    try {
      const validatedData = insertPromoSchema.parse(req.body);
      const promo = await storage.createPromo(validatedData);
      res.status(201).json(promo);
    } catch (error) {
      res.status(400).json({ message: "Invalid promo data", error });
    }
  });
  
  app.put("/api/promos/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid promo ID" });
      }
      
      const promo = await storage.getPromos().then(promos => 
        promos.find(p => p.id === id)
      );
      if (!promo) {
        return res.status(404).json({ message: "Promo not found" });
      }
      
      const validatedData = insertPromoSchema.partial().parse(req.body);
      const updatedPromo = await storage.updatePromo(id, validatedData);
      res.json(updatedPromo);
    } catch (error) {
      res.status(400).json({ message: "Invalid promo data", error });
    }
  });
  
  app.delete("/api/promos/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid promo ID" });
      }
      
      const success = await storage.deletePromo(id);
      if (!success) {
        return res.status(404).json({ message: "Promo not found" });
      }
      
      res.json({ message: "Promo deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting promo", error });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
