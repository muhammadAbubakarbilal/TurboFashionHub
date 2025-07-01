// E-commerce site configuration

export const siteConfig = {
  name: "8Bull",
  description: "Premium fashion clothing and accessories for men and women",
  currency: {
    code: "INR",
    symbol: "₹",
    format: (price: number) => `₹${price.toFixed(2)}`,
  },
  shipping: {
    freeShippingThreshold: 5000,
  },
  promoCode: "WELCOME15",
  promoDiscount: 15, // percentage
  contactEmail: "support@8bull.com",
  socials: {
    facebook: "https://facebook.com/8bull",
    instagram: "https://instagram.com/8bull",
    twitter: "https://twitter.com/8bull",
    pinterest: "https://pinterest.com/8bull",
  },
  pageTitles: {
    home: "8Bull - Premium Fashion Clothing",
    category: "Shop %s | 8Bull",
    product: "%s | 8Bull",
    cart: "Your Cart | 8Bull",
    checkout: "Checkout | 8Bull",
  }
};
