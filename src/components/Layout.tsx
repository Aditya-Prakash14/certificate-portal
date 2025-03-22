import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, LogOut, Menu, X, Home as HomeIcon, User, Cpu, ChevronRight, Zap } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, signOut, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24
      }
    }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto', 
      transition: { 
        duration: 0.3, 
        ease: "easeInOut" 
      }
    }
  };

  const logoVariants = {
    hover: { 
      scale: 1.05,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 10 
      }
    },
    tap: { scale: 0.95 }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cyberpunk-darker relative">
      {/* Scanner effect overlay */}
      <div className="retro-scanline"></div>
      
      {/* Animated background decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 opacity-10 mix-blend-screen">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f016f4" d="M45.3,-56.3C58.8,-45.2,70,-30.6,73.1,-14.7C76.3,1.3,71.3,18.6,62.5,32.8C53.7,47,41,58.2,26.1,63.9C11.2,69.7,-5.9,70,-21.3,64.5C-36.8,59,-50.7,47.8,-58.6,33.8C-66.5,19.7,-68.4,2.8,-64.1,-11.7C-59.8,-26.2,-49.4,-38.2,-37.1,-49.9C-24.8,-61.5,-10.4,-72.8,3.3,-76.8C17.1,-80.8,31.8,-67.5,45.3,-56.3Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 opacity-10 mix-blend-screen">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#08f7fe" d="M41.2,-51.2C52.6,-46,60.8,-32.5,67.6,-16.9C74.3,-1.2,79.5,16.8,73.2,29.4C66.9,42,49.1,49.3,32.7,56.9C16.3,64.5,1.5,72.5,-14.2,72.1C-29.8,71.8,-46.3,63.1,-59.3,49.9C-72.3,36.7,-81.7,19,-81.1,1.8C-80.4,-15.3,-69.8,-30.7,-56.7,-36.1C-43.6,-41.6,-28,-37.1,-16.5,-42.2C-5,-47.3,3.5,-61.9,14.5,-64.2C25.6,-66.5,39.2,-56.4,41.2,-51.2Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="absolute top-1/3 left-1/3 w-1/4 h-1/4 opacity-10 mix-blend-screen animate-float">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f5d300" d="M47.3,-57.2C59.4,-49.3,66.5,-32.4,73.1,-13.7C79.8,5,86,25.4,79.8,39.4C73.5,53.5,54.8,61.2,37.4,65C20.1,68.8,4.1,68.8,-12.4,66.4C-28.9,64,-45.9,59.3,-57.9,48.1C-70,36.9,-77.2,19.4,-75.8,3.2C-74.4,-13,-64.4,-26,-54.5,-35.9C-44.6,-45.8,-34.7,-52.6,-23.1,-61.2C-11.5,-69.8,1.7,-80.1,14.1,-77.3C26.5,-74.6,38,-65.1,47.3,-57.2Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>
      
      <motion.nav 
        className={`bg-cyberpunk-dark border-b border-cyberpunk-accent/30 sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-[0_0_15px_rgba(8,247,254,0.3)]' : ''}`}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.div
                variants={logoVariants}
                whileHover="hover"
                whileTap="tap"
                className="relative"
              >
                <Link to="/" className="flex items-center">
                  <span className="relative">
                    <Zap className="h-8 w-8 text-cyberpunk-accent animate-pulse" />
                    <span className="absolute inset-0 blur-sm animate-pulse">
                      <Zap className="h-8 w-8 text-cyberpunk-accent" />
                    </span>
                  </span>
                  <span className="ml-2 text-xl font-bold neon-text">
                    TEKRON<span className="text-cyberpunk-primary">FEST</span>
                  </span>
                </Link>
              </motion.div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <motion.div variants={navItemVariants} initial="hidden" animate="visible">
                  <Link
                    to="/"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive('/') && !isActive('/search') && !isActive('/admin') && !isActive('/login')
                        ? 'border-cyberpunk-accent text-cyberpunk-accent'
                        : 'border-transparent text-gray-400 hover:border-gray-300 hover:text-cyberpunk-accent/70'
                    }`}
                  >
                    <HomeIcon className="h-4 w-4 mr-1" />
                    <span>Home</span>
                  </Link>
                </motion.div>
                <motion.div variants={navItemVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                  <Link
                    to="/search"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive('/search')
                        ? 'border-cyberpunk-accent text-cyberpunk-accent'
                        : 'border-transparent text-gray-400 hover:border-gray-300 hover:text-cyberpunk-accent/70'
                    }`}
                  >
                    <Search className="h-4 w-4 mr-1" />
                    <span>Search Certificates</span>
                  </Link>
                </motion.div>
                {isAdmin && (
                  <motion.div variants={navItemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                    <Link
                      to="/admin"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive('/admin')
                          ? 'border-cyberpunk-primary text-cyberpunk-primary'
                          : 'border-transparent text-gray-400 hover:border-gray-300 hover:text-cyberpunk-primary/70'
                      }`}
                    >
                      <Cpu className="h-4 w-4 mr-1" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:flex">
                {user ? (
                  <motion.div 
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-sm text-gray-400 hidden lg:inline-flex items-center px-3 py-1 rounded-full bg-cyberpunk-dark-purple border border-cyberpunk-accent/30">
                      <User className="h-4 w-4 mr-1 text-cyberpunk-accent" />
                      {user.email}
                    </span>
                    <motion.button
                      onClick={handleSignOut}
                      disabled={loading}
                      className="neon-button group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2 group-hover:translate-x-0.5 transition-transform" />
                        Sign Out
                      </span>
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      to="/login"
                      className={`neon-button-pink group ${
                        isActive('/login') ? 'bg-cyberpunk-primary/20' : ''
                      }`}
                    >
                      <motion.span 
                        className="flex items-center"
                        whileHover={{ x: 2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        Sign In
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </motion.span>
                    </Link>
                  </motion.div>
                )}
              </div>
              <div className="flex items-center md:hidden">
                <motion.button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-cyberpunk-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyberpunk-accent"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="sr-only">Open main menu</span>
                  <AnimatePresence initial={false} mode="wait">
                    {mobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="block h-6 w-6" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="block h-6 w-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="md:hidden bg-cyberpunk-dark-purple backdrop-blur-sm border-b border-cyberpunk-accent/30"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="pt-2 pb-3 space-y-1">
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    to="/"
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      isActive('/') && !isActive('/search') && !isActive('/admin') && !isActive('/login')
                        ? 'border-cyberpunk-accent text-cyberpunk-accent bg-cyberpunk-accent/5'
                        : 'border-transparent text-gray-400 hover:bg-cyberpunk-accent/5 hover:border-cyberpunk-accent/50 hover:text-cyberpunk-accent/80'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <HomeIcon className="h-4 w-4 inline-block mr-2" />
                    Home
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    to="/search"
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      isActive('/search')
                        ? 'border-cyberpunk-accent text-cyberpunk-accent bg-cyberpunk-accent/5'
                        : 'border-transparent text-gray-400 hover:bg-cyberpunk-accent/5 hover:border-cyberpunk-accent/50 hover:text-cyberpunk-accent/80'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Search className="h-4 w-4 inline-block mr-2" />
                    Search Certificates
                  </Link>
                </motion.div>
                {isAdmin && (
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      to="/admin"
                      className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                        isActive('/admin')
                          ? 'border-cyberpunk-primary text-cyberpunk-primary bg-cyberpunk-primary/5'
                          : 'border-transparent text-gray-400 hover:bg-cyberpunk-primary/5 hover:border-cyberpunk-primary/50 hover:text-cyberpunk-primary/80'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Cpu className="h-4 w-4 inline-block mr-2" />
                      Admin Dashboard
                    </Link>
                  </motion.div>
                )}
                <div className="pt-4 pb-3 border-t border-cyberpunk-accent/10">
                  {user ? (
                    <>
                      <div className="flex items-center px-4 mb-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-cyberpunk-dark-blue border border-cyberpunk-accent/30 flex items-center justify-center">
                            <User className="h-5 w-5 text-cyberpunk-accent" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-base font-medium text-cyberpunk-accent">{user.email}</div>
                        </div>
                      </div>
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSignOut();
                        }}
                        className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-400 hover:bg-cyberpunk-accent/5 hover:border-cyberpunk-accent/50 hover:text-cyberpunk-accent/80"
                      >
                        <LogOut className="h-4 w-4 inline-block mr-2" />
                        Sign out
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-400 hover:bg-cyberpunk-primary/5 hover:border-cyberpunk-primary/50 hover:text-cyberpunk-primary/80"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <ChevronRight className="h-4 w-4 inline-block mr-2" />
                      Sign in
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      <footer className="bg-cyberpunk-dark border-t border-cyberpunk-accent/30 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Zap className="h-6 w-6 text-cyberpunk-accent" />
              <span className="ml-2 text-lg font-bold text-gray-400">
                TEKRON<span className="text-cyberpunk-primary">FEST</span>
              </span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-cyberpunk-accent">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-cyberpunk-accent">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-cyberpunk-accent">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-4 text-center md:text-right text-sm text-gray-500">
            <p>© {new Date().getFullYear()} TEKRONFEST. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}