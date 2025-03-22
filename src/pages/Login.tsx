import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { AlertTriangle, UserPlus, Mail, KeyRound, ArrowRight, Loader2, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();
  const { signIn, error, clearError, loading, user, isAdmin } = useAuthStore();

  // Clear any existing errors when component mounts or unmounts
  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        // Check if email ends with @admin.com
        if (!email.endsWith('@admin.com')) {
          throw new Error('Only @admin.com email addresses are allowed for registration');
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        // After successful signup, sign in
        await signIn(email, password);
      } else {
        await signIn(email, password);
      }
      navigate('/admin');
    } catch {
      // Error is handled by the auth store
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const switchVariants = {
    signup: { x: 10, opacity: 1 },
    signin: { x: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8 relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-cyberpunk-primary/5 mix-blend-screen filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-cyberpunk-accent/5 mix-blend-screen filter blur-3xl"></div>
      </div>
      
      <motion.div 
        className="sm:mx-auto sm:w-full sm:max-w-md"
        variants={itemVariants}
      >
        <motion.div 
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyberpunk-dark-purple border border-cyberpunk-accent/40 relative"
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(8, 247, 254, 0.5)' }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="h-8 w-8 text-cyberpunk-accent animate-pulse" />
          <div className="absolute inset-0 rounded-full border border-cyberpunk-accent/20 animate-ping opacity-50"></div>
        </motion.div>
        <motion.h2 
          className="mt-6 text-center text-3xl font-bold tracking-tight neon-text"
          variants={itemVariants}
        >
          {isSignUp ? 'TEKRON_REGISTER' : 'TEKRON_ACCESS'}
        </motion.h2>
        <motion.p 
          className="mt-2 text-center text-sm text-gray-400"
          variants={itemVariants}
        >
          {isSignUp 
            ? 'Create a new admin account with @admin.com email'
            : 'Enter your credentials to access the TEKRON network'
          }
        </motion.p>
      </motion.div>

      <motion.div 
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        variants={itemVariants}
      >
        <motion.div 
          className="cyberpunk-card overflow-hidden backdrop-blur-sm"
          whileHover={{ boxShadow: "0 0 20px rgba(8, 247, 254, 0.3)" }}
          transition={{ duration: 0.2 }}
        >
          <form className="space-y-6 p-6 sm:p-8" onSubmit={handleSubmit}>
            {error && (
              <motion.div 
                className="p-4 rounded-md bg-red-900/40 border border-red-500/50 text-red-300 flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <div className="text-sm">{error}</div>
              </motion.div>
            )}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email address
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-200 ${emailFocused ? 'text-cyberpunk-accent' : 'text-gray-500'}`}>
                  <Mail className="h-5 w-5" />
                </div>
                <motion.input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className="cyber-input block w-full pl-10 py-3 sm:text-sm"
                  placeholder={isSignUp ? "you@admin.com" : "admin@admin.com"}
                  whileFocus={{ scale: 1.01 }}
                />
                {emailFocused && (
                  <AnimatePresence>
                    <motion.span
                      className="absolute inset-0 border border-cyberpunk-accent/50 rounded-sm pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layoutId="focus-border"
                    />
                  </AnimatePresence>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-200 ${passwordFocused ? 'text-cyberpunk-accent' : 'text-gray-500'}`}>
                  <KeyRound className="h-5 w-5" />
                </div>
                <motion.input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="cyber-input block w-full pl-10 py-3 sm:text-sm"
                  placeholder="••••••••"
                  whileFocus={{ scale: 1.01 }}
                />
                {passwordFocused && (
                  <AnimatePresence>
                    <motion.span
                      className="absolute inset-0 border border-cyberpunk-accent/50 rounded-sm pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layoutId="focus-border"
                    />
                  </AnimatePresence>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={loading}
                className={`neon-button-pink w-full justify-center py-3 ${loading ? 'opacity-70' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {isSignUp ? 'CREATING_IDENTITY...' : 'AUTHENTICATING...'}
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    {isSignUp ? 'CREATE_IDENTITY' : 'AUTHENTICATE'}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </motion.button>
            </motion.div>

            <motion.div 
              className="text-center mt-6"
              variants={itemVariants}
            >
              <motion.div 
                className="relative inline-block"
                animate={isSignUp ? "signup" : "signin"}
                variants={switchVariants}
              >
                <motion.button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-cyberpunk-accent hover:text-cyberpunk-accent/80 flex items-center justify-center mx-auto py-2 px-4 rounded-sm border border-transparent hover:border-cyberpunk-accent/20 transition-all duration-200"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(8, 247, 254, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isSignUp ? '< RETURN_TO_LOGIN' : 'REQUEST_NEW_IDENTITY >'}
                </motion.button>
              </motion.div>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}