import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1E293B] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">TURBO<span className="text-[#FB923C]">BRANDS</span></h3>
            <p className="text-white/70 mb-6">Elevating your style with premium quality clothing and accessories since 2010.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-[#FB923C] transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-[#FB923C] transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-[#FB923C] transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-[#FB923C] transition-colors" aria-label="Linkedin">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Shop Links */}
          <div>
            <h4 className="font-bold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/category/Women" className="text-white/70 hover:text-white transition-colors">Women</Link></li>
              <li><Link href="/category/Men" className="text-white/70 hover:text-white transition-colors">Men</Link></li>
              <li><Link href="/category/Accessories" className="text-white/70 hover:text-white transition-colors">Accessories</Link></li>
              <li><Link href="/category/new-arrivals" className="text-white/70 hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/category/Sale" className="text-white/70 hover:text-white transition-colors">Sale</Link></li>
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Store Locator</a></li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h4 className="font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Order Tracking</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm mb-4 md:mb-0">&copy; 2023 Turbo Brands Factory. All rights reserved.</p>
          <div className="flex space-x-4">
            <svg className="h-6 w-auto" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="60" height="40" rx="4" fill="white" fillOpacity="0.1"/>
              <path d="M20 28H40V12H20V28Z" fill="#172B85"/>
              <path d="M22 20C22 16.13 25.13 13 29 13C32.87 13 36 16.13 36 20C36 23.87 32.87 27 29 27C25.13 27 22 23.87 22 20Z" fill="#F7B600"/>
            </svg>
            <svg className="h-6 w-auto" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="60" height="40" rx="4" fill="white" fillOpacity="0.1"/>
              <path d="M38 20C38 24.42 34.42 28 30 28C25.58 28 22 24.42 22 20C22 15.58 25.58 12 30 12C34.42 12 38 15.58 38 20Z" fill="#FFB600"/>
              <path d="M30 28C34.42 28 38 24.42 38 20C38 15.58 34.42 12 30 12" fill="#F7981D"/>
              <path d="M30 28C34.42 28 38 24.42 38 20H22C22 24.42 25.58 28 30 28Z" fill="#FF8500"/>
              <path d="M24.5 15.5L35.5 24.5" stroke="white" strokeWidth="1.5" strokeMiterlimit="10"/>
              <path d="M35.5 15.5L24.5 24.5" stroke="white" strokeWidth="1.5" strokeMiterlimit="10"/>
            </svg>
            <svg className="h-6 w-auto" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="60" height="40" rx="4" fill="white" fillOpacity="0.1"/>
              <path d="M25 16H35C36.1 16 37 16.9 37 18V22C37 23.1 36.1 24 35 24H25C23.9 24 23 23.1 23 22V18C23 16.9 23.9 16 25 16Z" fill="#253B80"/>
              <path d="M30 22C31.66 22 33 20.66 33 19C33 17.34 31.66 16 30 16C28.34 16 27 17.34 27 19C27 20.66 28.34 22 30 22Z" fill="#179BD7"/>
            </svg>
            <svg className="h-6 w-auto" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="60" height="40" rx="4" fill="white" fillOpacity="0.1"/>
              <path d="M24 16H36C37.1 16 38 16.9 38 18V22C38 23.1 37.1 24 36 24H24C22.9 24 22 23.1 22 22V18C22 16.9 22.9 16 24 16Z" fill="black"/>
              <path d="M30 22C31.6569 22 33 20.6569 33 19C33 17.3431 31.6569 16 30 16C28.3431 16 27 17.3431 27 19C27 20.6569 28.3431 22 30 22Z" fill="white"/>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
