import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Star, ShoppingCart, Heart, Zap, Award, Users, Truck, User, Search, Menu, X, Filter, ArrowRight, Plus, Minus } from 'lucide-react';

// Components
import LoadingScreen from './components/LoadingScreen';
import { ScrollReveal, PeelReveal, Parallax } from './components/ScrollAnimations';
import TiltCard from './components/TiltCard';
import GlowingBackground from './components/GlowingBackground';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newsletter, setNewsletter] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [productQuantities, setProductQuantities] = useState<{[key: string]: number}>({});
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollVelocity(currentScrollY - lastScrollY);
      setScrollY(currentScrollY);
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick);
    setIsVisible(true);
    
    return () => window.removeEventListener('scroll', requestTick);
  }, []);

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const products = [
    {
      id: '1',
      name: "Premium Almonds",
      price: 2074, // 24.99 * 83
      originalPrice: 2489, // 29.99 * 83
      image: "https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.9,
      reviews: 156,
      badge: "Best Seller",
      discount: "17% OFF",
      category: "nuts",
      description: "Premium California almonds, rich in protein and healthy fats. Perfect for snacking or cooking."
    },
    {
      id: '2',
      name: "Roasted Cashews",
      price: 2406, // 28.99 * 83
      originalPrice: 2904, // 34.99 * 83
      image: "https://images.pexels.com/photos/4113643/pexels-photo-4113643.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.8,
      reviews: 203,
      badge: "Premium",
      discount: "17% OFF",
      category: "nuts",
      description: "Perfectly roasted cashews with a buttery texture and rich flavor. Ideal for healthy snacking."
    },
    {
      id: '3',
      name: "Mixed Nuts Deluxe",
      price: 2738, // 32.99 * 83
      originalPrice: 3319, // 39.99 * 83
      image: "https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.9,
      reviews: 189,
      badge: "Chef's Choice",
      discount: "18% OFF",
      category: "mixed",
      description: "A premium blend of almonds, cashews, walnuts, and pistachios. The perfect healthy mix."
    },
    {
      id: '4',
      name: "Honey Roasted Walnuts",
      price: 2240, // 26.99 * 83
      originalPrice: 2655, // 31.99 * 83
      image: "https://images.pexels.com/photos/4113643/pexels-photo-4113643.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.7,
      reviews: 142,
      badge: "Limited",
      discount: "16% OFF",
      category: "nuts",
      description: "Walnuts roasted with pure honey, creating a perfect balance of sweet and nutty flavors."
    },
    {
      id: '5',
      name: "Dried Dates Premium",
      price: 1908, // 22.99 * 83
      originalPrice: 2323, // 27.99 * 83
      image: "https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.8,
      reviews: 98,
      badge: "Organic",
      discount: "18% OFF",
      category: "dates",
      description: "Organic Medjool dates, naturally sweet and packed with fiber, potassium, and antioxidants."
    },
    {
      id: '6',
      name: "Pistachios Roasted",
      price: 2987, // 35.99 * 83
      originalPrice: 3568, // 42.99 * 83
      image: "https://images.pexels.com/photos/4113643/pexels-photo-4113643.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 4.9,
      reviews: 234,
      badge: "Premium",
      discount: "16% OFF",
      category: "nuts",
      description: "Premium roasted pistachios with a distinctive flavor and satisfying crunch. Rich in protein."
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'nuts', name: 'Nuts' },
    { id: 'dates', name: 'Dates' },
    { id: 'mixed', name: 'Mixed' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((total, count) => total + count, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cartItems).reduce((total, [productId, count]) => {
      const product = products.find(p => p.id === productId);
      return total + (product ? product.price * count : 0);
    }, 0);
  };

  const addToCart = (productId: string, quantity: number = 1) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + quantity
    }));
    const product = products.find(p => p.id === productId);
    showNotificationMessage(`${quantity} x ${product?.name} added to cart!`);
    // Reset quantity selector
    setProductQuantities(prev => ({ ...prev, [productId]: 1 }));
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const product = products.find(p => p.id === productId);
      if (prev.includes(productId)) {
        showNotificationMessage(`${product?.name} removed from wishlist`);
        return prev.filter(id => id !== productId);
      } else {
        showNotificationMessage(`${product?.name} added to wishlist!`);
        return [...prev, productId];
      }
    });
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'signup') {
      if (authForm.password !== authForm.confirmPassword) {
        showNotificationMessage('Passwords do not match!');
        return;
      }
      showNotificationMessage('Account created successfully!');
    } else {
      showNotificationMessage('Signed in successfully!');
    }
    setShowAuthModal(false);
    setAuthForm({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletter) {
      showNotificationMessage('Successfully subscribed to newsletter!');
      setNewsletter('');
    }
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) quantity = 1;
    if (quantity > 10) quantity = 10; // Max limit
    setProductQuantities(prev => ({ ...prev, [productId]: quantity }));
  };

  const getProductQuantity = (productId: string) => {
    return productQuantities[productId] || 1;
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.05 }
  };

  const pageTransition = {
    type: 'tween',
    ease: [0.76, 0, 0.24, 1],
    duration: 0.6
  };

  const AuthModal = () => (
    <AnimatePresence>
      {showAuthModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="premium-glass-card max-w-md w-full mx-4 p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-amber-100">
                {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
              </h2>
              <button 
                onClick={() => setShowAuthModal(false)}
                className="text-amber-200 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-amber-200 text-sm font-medium mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={authForm.name}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                    className="premium-input w-full px-4 py-3 rounded-lg"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-amber-200 text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  value={authForm.email}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                  className="premium-input w-full px-4 py-3 rounded-lg"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-amber-200 text-sm font-medium mb-2">Password</label>
                <input 
                  type="password" 
                  value={authForm.password}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                  className="premium-input w-full px-4 py-3 rounded-lg"
                  placeholder="Enter your password"
                  required
                />
              </div>
              {authMode === 'signup' && (
                <div>
                  <label className="block text-amber-200 text-sm font-medium mb-2">Confirm Password</label>
                  <input 
                    type="password" 
                    value={authForm.confirmPassword}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="premium-input w-full px-4 py-3 rounded-lg"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}
              
              <motion.button 
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full premium-button-primary px-6 py-3 rounded-lg font-semibold"
              >
                {authMode === 'signin' ? 'Sign In' : 'Create Account'}
              </motion.button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-amber-200/70">
                {authMode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                <button 
                  onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                  className="ml-2 text-amber-400 hover:text-amber-300 font-semibold"
                >
                  {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const SearchModal = () => (
    <AnimatePresence>
      {showSearch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            className="premium-glass-card max-w-2xl w-full mx-4 p-6"
          >
            <div className="flex items-center space-x-4 mb-4">
              <Search className="w-6 h-6 text-amber-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent text-amber-100 placeholder-amber-300/50 focus:outline-none text-lg"
                autoFocus
              />
              <button 
                onClick={() => setShowSearch(false)}
                className="text-amber-200 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {searchQuery && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredProducts.map(product => (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="flex items-center space-x-3 p-3 hover:bg-amber-100/10 rounded-lg cursor-pointer"
                  >
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div>
                      <h4 className="text-amber-100 font-medium">{product.name}</h4>
                      <p className="text-amber-400 font-semibold">₹{product.price.toLocaleString('en-IN')}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const FilterModal = () => (
    <AnimatePresence>
      {showFilter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="premium-glass-card max-w-md w-full mx-4 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-amber-100">Filter Products</h3>
              <button 
                onClick={() => setShowFilter(false)}
                className="text-amber-200 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-amber-200 font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.02, x: 5 }}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setShowFilter(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id 
                          ? 'bg-amber-500/30 text-amber-100' 
                          : 'text-amber-200/70 hover:bg-amber-100/10'
                      }`}
                    >
                      {category.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const Notification = () => (
    <AnimatePresence>
      {showNotification && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ 
              scale: [0.8, 1.1, 1], 
              opacity: 1, 
              y: 0,
              transition: { 
                type: "tween", 
                damping: 15, 
                stiffness: 300,
                duration: 0.6 
              }
            }}
            exit={{ 
              scale: 0.8, 
              opacity: 0, 
              y: -20,
              transition: { duration: 0.3 }
            }}
            className="premium-glass-card p-6 mx-4 max-w-sm pointer-events-auto"
          >
            <div className="flex items-center space-x-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
              >
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </motion.svg>
              </motion.div>
              <div>
                <p className="text-amber-100 font-semibold text-sm">Success!</p>
                <p className="text-amber-200/80 text-sm">{notificationMessage}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-red-950 text-amber-50 overflow-hidden"
    >
      <GlowingBackground />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        className={`fixed top-0 w-full z-40 transition-all duration-700 ${
          scrollY > 50 ? 'premium-nav-blur border-b border-amber-300/10' : ''
        }`}
        style={{
          transform: `translateY(${Math.min(scrollVelocity * 0.5, 10)}px)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent cursor-pointer"
              onClick={() => scrollToSection('hero')}
            >
              DryFruits Premium
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { name: 'Home', id: 'hero' },
                { name: 'Products', id: 'products' },
                { name: 'Features', id: 'features' },
                { name: 'Newsletter', id: 'newsletter' }
              ].map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  onClick={() => scrollToSection(item.id)}
                  className="relative text-amber-200/80 hover:text-amber-100 transition-all duration-300 nav-link"
                >
                  {item.name}
                </motion.button>
              ))}
            </div>

            {/* Desktop Auth & Cart */}
            <div className="hidden md:flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSearch(true)}
                className="p-2 text-amber-200 hover:text-amber-100 transition-colors"
              >
                <Search className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAuthModal(true)}
                className="premium-button px-4 py-2 rounded-lg flex items-center"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="premium-button-primary px-4 py-2 rounded-lg flex items-center relative"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {getTotalCartItems() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {getTotalCartItems()}
                  </motion.span>
                )}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden text-amber-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 pb-4 border-t border-amber-300/20"
              >
                <div className="flex flex-col space-y-4 pt-4">
                  {[
                    { name: 'Home', id: 'hero' },
                    { name: 'Products', id: 'products' },
                    { name: 'Features', id: 'features' },
                    { name: 'Newsletter', id: 'newsletter' }
                  ].map((item, index) => (
                    <motion.button
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => scrollToSection(item.id)}
                      className="text-amber-200 hover:text-amber-100 transition-colors text-left"
                    >
                      {item.name}
                    </motion.button>
                  ))}
                  <div className="flex flex-col space-y-2 pt-4 border-t border-amber-300/20">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        setShowSearch(true);
                        setIsMenuOpen(false);
                      }}
                      className="premium-button px-4 py-2 rounded-lg text-left flex items-center"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        setShowAuthModal(true);
                        setIsMenuOpen(false);
                      }}
                      className="premium-button px-4 py-2 rounded-lg text-left"
                    >
                      Sign In
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="premium-button-primary px-4 py-2 rounded-lg flex items-center justify-between"
                    >
                      <span>Cart</span>
                      {getTotalCartItems() > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {getTotalCartItems()}
                        </span>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <ScrollReveal className="space-y-8">
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-6xl md:text-8xl font-bold leading-tight"
              >
                Premium
                <motion.span
                  className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  Dry Fruits
                </motion.span>
                <br />
                <span className="text-4xl md:text-6xl text-amber-200/80">& Nuts</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-xl md:text-2xl text-amber-200/70 max-w-lg leading-relaxed"
              >
                Discover nature's finest treasures - premium dry fruits and nuts, carefully selected and delivered fresh to your doorstep.
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('products')}
                className="premium-button-primary px-8 py-4 rounded-full text-lg font-semibold"
              >
                <Zap className="w-6 h-6 mr-2" />
                Shop Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('features')}
                className="premium-glass-button px-8 py-4 rounded-full text-lg font-semibold"
              >
                Explore Features
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="flex items-center space-x-8 pt-8"
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl font-bold text-amber-400"
                >
                  50K+
                </motion.div>
                <div className="text-amber-300/60">Happy Customers</div>
              </div>
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="text-3xl font-bold text-orange-400"
                >
                  4.9
                </motion.div>
                <div className="text-amber-300/60 flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  Rating
                </div>
              </div>
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="text-3xl font-bold text-red-400"
                >
                  100%
                </motion.div>
                <div className="text-amber-300/60">Natural</div>
              </div>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal delay={0.3} className="relative">
            <Parallax speed={0.3}>
              <TiltCard className="premium-glass-card p-8 transform rotate-6 hover:rotate-3 transition-all duration-500">
                <img 
                  src="https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=500" 
                  alt="Premium Dry Fruits" 
                  className="w-full h-64 object-cover rounded-xl mb-4"
                />
                <h3 className="text-2xl font-bold mb-2 text-amber-100">Premium Selection</h3>
                <p className="text-amber-200/70">Handpicked for perfection</p>
              </TiltCard>
            </Parallax>
            
            <Parallax speed={0.5}>
              <TiltCard className="premium-glass-card p-6 absolute -top-8 -right-8 transform -rotate-12 hover:-rotate-6 transition-all duration-500">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-6 h-6 text-amber-400" />
                  <span className="font-semibold text-amber-100">Award Winning</span>
                </div>
                <p className="text-sm text-amber-200/70">Best Quality 2024</p>
              </TiltCard>
            </Parallax>
            
            <Parallax speed={0.7}>
              <TiltCard className="premium-glass-card p-4 absolute -bottom-4 -left-4 transform rotate-12 hover:rotate-6 transition-all duration-500">
                <div className="flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-semibold text-amber-100">Free Shipping</span>
                </div>
              </TiltCard>
            </Parallax>
          </ScrollReveal>
        </div>

        <motion.button
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => scrollToSection('products')}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        >
          <ChevronDown className="w-8 h-8 text-amber-300/60" />
        </motion.button>
      </section>

      {/* Products Section */}
      <section id="products" className="relative z-10 py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-amber-950/40 to-amber-950/20"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-5xl md:text-6xl font-bold mb-6">
                  Our <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Products</span>
                </h2>
                <p className="text-xl text-amber-200/70 max-w-2xl">
                  Each product is carefully selected and processed to bring out the best flavors and nutritional benefits.
                </p>
              </motion.div>
              <motion.button
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilter(true)}
                className="premium-button px-6 py-3 rounded-lg flex items-center"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filter ({selectedCategory === 'all' ? 'All' : categories.find(c => c.id === selectedCategory)?.name})
              </motion.button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <TiltCard className="premium-product-card group">
                    <div className="relative overflow-hidden rounded-2xl mb-4">
                      <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-xs font-semibold text-white">
                        {product.badge}
                      </span>
                      <span className="absolute top-4 right-4 z-10 px-2 py-1 bg-red-500 rounded-lg text-xs font-semibold text-white">
                        {product.discount}
                      </span>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <Heart className={`w-6 h-6 ${wishlist.includes(product.id) ? 'text-red-500 fill-current' : 'text-white'}`} />
                      </motion.button>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-amber-100">{product.name}</h3>
                      <p className="text-amber-200/60 text-sm">{product.description}</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-current' : 'text-amber-400/30'}`} />
                          ))}
                        </div>
                        <span className="text-amber-300/70 text-sm">({product.reviews})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-amber-400">₹{product.price.toLocaleString('en-IN')}</span>
                          <span className="text-lg text-amber-300/50 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      
                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3 bg-amber-900/30 rounded-lg p-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateProductQuantity(product.id, getProductQuantity(product.id) - 1)}
                            className="w-8 h-8 bg-amber-600/40 rounded-full hover:bg-amber-600/60 transition-colors flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4 text-amber-200" />
                          </motion.button>
                          <span className="text-amber-100 font-semibold min-w-[30px] text-center">
                            {getProductQuantity(product.id)}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateProductQuantity(product.id, getProductQuantity(product.id) + 1)}
                            className="w-8 h-8 bg-amber-600/40 rounded-full hover:bg-amber-600/60 transition-colors flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4 text-amber-200" />
                          </motion.button>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToCart(product.id, getProductQuantity(product.id))}
                          className="premium-button-primary px-4 py-2 rounded-lg flex items-center text-sm font-semibold"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add to Cart
                        </motion.button>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-amber-200/70 text-xl">No products found matching your criteria.</p>
              </div>
            )}

            <div className="text-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('features')}
                className="premium-button-primary px-8 py-4 rounded-full text-lg font-semibold"
              >
                View All Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Why Choose <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Us</span>
            </h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Award, title: "Premium Quality", desc: "Only the finest dry fruits and nuts make it to our selection", color: "text-amber-400" },
              { icon: Truck, title: "Fast Delivery", desc: "Fresh products delivered to your door in 24-48 hours", color: "text-orange-400" },
              { icon: Users, title: "50K+ Customers", desc: "Join thousands of satisfied customers worldwide", color: "text-red-400" }
            ].map((feature, index) => (
              <ScrollReveal key={feature.title} delay={index * 0.2}>
                <TiltCard className="premium-feature-card text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4 text-amber-100">{feature.title}</h3>
                  <p className="text-amber-200/70 leading-relaxed">{feature.desc}</p>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <TiltCard className="premium-glass-card p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-amber-100">
                Stay Updated with <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Premium Offers</span>
              </h2>
              <p className="text-xl text-amber-200/70 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter and get exclusive access to premium products, special offers, and nutrition tips.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input 
                  type="email" 
                  value={newsletter}
                  onChange={(e) => setNewsletter(e.target.value)}
                  placeholder="Enter your email"
                  className="premium-input flex-1 px-6 py-3 rounded-lg"
                  required
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="premium-button-primary px-6 py-3 rounded-lg font-semibold"
                >
                  Subscribe
                </motion.button>
              </form>
            </TiltCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Cart Summary */}
      <AnimatePresence>
        {getTotalCartItems() > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed bottom-4 right-4 z-40 premium-glass-card p-4"
          >
            <div className="text-amber-100 font-semibold mb-2">
              Cart: {getTotalCartItems()} items
            </div>
            <div className="text-amber-400 font-bold text-lg">
              Total: ₹{getTotalPrice().toLocaleString('en-IN')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-amber-300/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <ScrollReveal>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-4">
                  DryFruits Premium
                </div>
                <p className="text-amber-300/60 mb-4">Premium dry fruits and nuts for a healthy lifestyle</p>
              </div>
            </ScrollReveal>
            {[
              {
                title: 'Quick Links',
                links: [
                  { name: 'Home', id: 'hero' },
                  { name: 'Products', id: 'products' },
                  { name: 'Features', id: 'features' },
                  { name: 'Newsletter', id: 'newsletter' }
                ]
              },
              {
                title: 'Categories',
                links: ['Almonds', 'Cashews', 'Dates', 'Walnuts', 'Pistachios'].map(name => ({ name, id: '' }))
              },
              {
                title: 'Support',
                links: ['Contact Us', 'FAQ', 'Shipping', 'Returns'].map(name => ({ name, id: '' }))
              }
            ].map((section, index) => (
              <ScrollReveal key={section.title} delay={index * 0.1}>
                <div>
                  <h4 className="text-amber-100 font-semibold mb-4">{section.title}</h4>
                  <div className="space-y-2">
                    {section.links.map((link) => (
                      <motion.button
                        key={link.name}
                        whileHover={{ x: 5 }}
                        onClick={() => link.id && scrollToSection(link.id)}
                        className="block text-amber-300/60 hover:text-amber-200 transition-colors text-left"
                      >
                        {link.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="border-t border-amber-300/10 pt-8 text-center">
            <p className="text-amber-300/60">© 2024 DryFruits Premium. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal />
      <SearchModal />
      <FilterModal />
      <Notification />
    </motion.div>
  );
}

export default App;