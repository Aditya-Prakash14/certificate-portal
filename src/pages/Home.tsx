import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Award, Shield, ChevronRight, ArrowRight, Zap, Terminal, Database, Cpu } from 'lucide-react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

export function Home() {
  const titleControls = useAnimation();
  const lineRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const startGlitchEffect = async () => {
      // Initial animation sequence
      await titleControls.start({
        opacity: [0, 0.5, 0.8, 1],
        filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
        transition: { duration: 2.5 }
      });
      
      // Start glitch effect after initial animation
      const glitchInterval = setInterval(() => {
        const shouldGlitch = Math.random() > 0.7;
        if (shouldGlitch) {
          titleControls.start({
            x: [0, -5, 5, -3, 3, 0],
            textShadow: [
              "0 0 5px rgba(8, 247, 254, 0.7), 0 0 10px rgba(8, 247, 254, 0.5)",
              "-5px 0 5px rgba(240, 22, 244, 0.7), 5px 0 10px rgba(8, 247, 254, 0.5)",
              "5px 0 5px rgba(240, 22, 244, 0.7), -5px 0 10px rgba(8, 247, 254, 0.5)",
              "0 0 5px rgba(8, 247, 254, 0.7), 0 0 10px rgba(8, 247, 254, 0.5)"
            ],
            transition: { duration: 0.3 }
          });
        }
      }, 5000);
      
      return () => clearInterval(glitchInterval);
    };
    
    startGlitchEffect();
  }, [titleControls]);
  
  // Simulate terminal typing animation for main description
  useEffect(() => {
    if (lineRef.current) {
      lineRef.current.style.animation = 'none';
      void lineRef.current.offsetWidth; // Trigger reflow
      lineRef.current.style.animation = 'terminal-typing 3.5s steps(40, end)';
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  };

  const featureCardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20,
        delay: 0.3 * i
      }
    }),
    hover: {
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const scanlineEffect = {
    initial: { top: 0 },
    animate: {
      top: "100%",
      transition: { 
        repeat: Infinity, 
        duration: 2, 
        ease: "linear" 
      }
    }
  };

  return (
    <motion.div 
      className="relative isolate overflow-hidden py-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-cyberpunk-darker" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-cyberpunk-grid bg-[size:50px_50px] opacity-10" />
        
        {/* Neon glow spots */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyberpunk-primary/10 filter blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyberpunk-accent/10 filter blur-[100px] animate-pulse" />
        
        {/* Scanline animation */}
        <motion.div 
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyberpunk-accent/30 to-transparent"
          variants={scanlineEffect}
          initial="initial"
          animate="animate"
        />
      </div>

      {/* Hero section */}
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32 relative">
        <div className="text-center relative z-10">
          <motion.div
            className="inline-block relative mb-4"
            animate={{
              filter: ["drop-shadow(0 0 8px rgba(8, 247, 254, 0.3)) drop-shadow(0 0 20px rgba(8, 247, 254, 0.3))", 
                      "drop-shadow(0 0 12px rgba(8, 247, 254, 0.5)) drop-shadow(0 0 30px rgba(8, 247, 254, 0.3))",
                      "drop-shadow(0 0 8px rgba(8, 247, 254, 0.3)) drop-shadow(0 0 20px rgba(8, 247, 254, 0.3))"],
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            <Zap className="h-16 w-16 mx-auto text-cyberpunk-accent" />
          </motion.div>
          
          <motion.h1
            className="text-5xl sm:text-7xl font-bold tracking-tighter neon-text mb-6 relative"
            animate={titleControls}
            initial={{ opacity: 0 }}
          >
            TEKRON<span className="neon-text-pink">FEST</span>
          </motion.h1>
          
          <motion.div 
            className="text-2xl sm:text-3xl font-mono text-cyberpunk-accent/80 mb-4"
            variants={itemVariants}
          >
            &lt; CERTIFICATE_PORTAL /&gt;
          </motion.div>
          
          <motion.div 
            className="mt-4 mx-auto max-w-2xl bg-cyberpunk-dark-purple/60 border border-cyberpunk-accent/40 rounded-md p-4 backdrop-blur-sm relative overflow-hidden"
            variants={itemVariants}
          >
            {/* Terminal-like effect */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyberpunk-primary/20 via-cyberpunk-accent to-cyberpunk-primary/20" />
            <div className="flex items-center text-xs text-gray-400 pb-2 mb-2 border-b border-cyberpunk-accent/20">
              <span className="mr-2 h-2 w-2 rounded-full bg-red-500" />
              <span className="mr-2 h-2 w-2 rounded-full bg-yellow-500" />
              <span className="mr-2 h-2 w-2 rounded-full bg-green-500" />
              <span className="ml-3 font-mono">crt@tekron:~/certificates$ _</span>
            </div>
            <div className="text-sm sm:text-base text-left font-mono terminal-text" ref={lineRef}>
              Access and verify digital certificates for TekronFest events, hackathons, and competitions.
              Secure, instant, and paperless certification system with blockchain verification.
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
            variants={itemVariants}
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Link
                to="/search"
                className="neon-button w-full sm:w-auto py-3 px-6 flex items-center justify-center group"
              >
                <Search className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                <span>VERIFY_CERTIFICATE</span>
              </Link>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Link
                to="/login"
                className="neon-button-pink w-full sm:w-auto py-3 px-6 flex items-center justify-center group"
              >
                <Terminal className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                <span>ACCESS_ADMIN</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features section */}
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-24">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.div 
            className="inline-block mb-3 bg-cyberpunk-dark-purple px-3 py-1 rounded-sm border border-cyberpunk-accent/30"
            variants={itemVariants}
          >
            <span className="text-sm font-mono text-cyberpunk-accent">// CORE_FEATURES</span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold tracking-tight neon-text-pink mb-4"
            variants={itemVariants}
          >
            SYSTEM_CAPABILITIES
          </motion.h2>
          
          <motion.div 
            className="h-1 w-40 mx-auto bg-gradient-to-r from-transparent via-cyberpunk-primary to-transparent"
            variants={itemVariants}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Search />,
              title: "VERIFICATION_MODULE",
              description: "Instant certificate authentication using quantum-secured validation algorithms and blockchain anchoring",
              delay: 0
            },
            {
              icon: <Cpu />,
              title: "DIGITAL_CERTIFICATES",
              description: "Generate tamper-proof digital credentials with advanced encryption and visual authentication markers",
              delay: 1
            },
            {
              icon: <Database />,
              title: "SECURE_STORAGE",
              description: "Distributed ledger technology ensuring immutable record-keeping with multi-layered access controls",
              delay: 2
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              className="cyberpunk-card p-6 relative overflow-hidden group h-full"
              custom={i}
              variants={featureCardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute rotate-45 bg-cyberpunk-accent/20 text-cyberpunk-accent w-24 flex justify-center py-1 -right-6 top-6 text-xs font-mono">
                  v1.0.{i+1}
                </div>
              </div>
              
              <div className="mb-4 inline-flex items-center justify-center p-2 rounded-md bg-cyberpunk-dark-blue/50 border border-cyberpunk-accent/30 group-hover:border-cyberpunk-accent/70 transition-all duration-300">
                <motion.div
                  className="text-cyberpunk-accent"
                  whileHover={{ 
                    rotate: 360,
                    transition: { duration: 0.5 }
                  }}
                >
                  {feature.icon}
                </motion.div>
              </div>
              
              <h3 className="text-xl font-bold text-cyberpunk-accent mb-2 font-mono tracking-tight">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 mb-4 text-sm">
                {feature.description}
              </p>
              
              <motion.div 
                className="flex items-center text-xs font-semibold text-cyberpunk-accent/80 mt-auto"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ type: "spring" }}
              >
                <span className="uppercase font-mono">ACCESS_DOCS</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </motion.div>
              
              {/* Animated border highlight on hover */}
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-cyberpunk-accent/60"
                initial={{ width: "30%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Stats section */}
      <div className="mx-auto max-w-7xl px-6 pb-24">
        <div className="cyberpunk-card overflow-hidden p-1">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-cyberpunk-accent/20">
            {[
              { value: "9,674+", label: "CERTIFICATES_ISSUED" },
              { value: "186+", label: "EVENTS_SECURED" },
              { value: "99.97%", label: "VERIFICATION_RATE" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                className="p-8 text-center relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (i * 0.2) }}
              >
                <motion.div 
                  className="text-4xl font-bold neon-text mb-2"
                  animate={{ 
                    textShadow: [
                      "0 0 5px rgba(8, 247, 254, 0.7), 0 0 10px rgba(8, 247, 254, 0.5)",
                      "0 0 7px rgba(8, 247, 254, 0.9), 0 0 14px rgba(8, 247, 254, 0.7)",
                      "0 0 5px rgba(8, 247, 254, 0.7), 0 0 10px rgba(8, 247, 254, 0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-gray-400 font-mono">
                  {stat.label}
                </div>
                
                {/* Top accent bar */}
                <motion.div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-cyberpunk-accent/50"
                  animate={{ 
                    width: ["30%", "60%", "30%"]
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="mx-auto max-w-5xl px-6 pb-32">
        <motion.div 
          className="relative overflow-hidden rounded-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyberpunk-dark-purple to-cyberpunk-dark-blue overflow-hidden">
            {/* Abstract geometric shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyberpunk-primary/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyberpunk-accent/10 rounded-full filter blur-3xl"></div>
            
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-cyberpunk-grid bg-[size:30px_30px] opacity-10"></div>
          </div>
          
          <div className="relative px-6 py-16 sm:px-16 sm:py-24 lg:px-24 flex flex-col items-center text-center">
            <motion.h2 
              className="text-3xl font-bold tracking-tight neon-text mb-4"
              animate={{ 
                textShadow: [
                  "0 0 5px rgba(8, 247, 254, 0.7), 0 0 10px rgba(8, 247, 254, 0.5)",
                  "0 0 10px rgba(8, 247, 254, 0.9), 0 0 20px rgba(8, 247, 254, 0.7)",
                  "0 0 5px rgba(8, 247, 254, 0.7), 0 0 10px rgba(8, 247, 254, 0.5)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              JOIN_THE_FUTURE
            </motion.h2>
            
            <p className="mx-auto max-w-xl text-lg text-gray-300 mb-8">
              Participate in TekronFest 2025 and earn verifiable digital certificates that enhance your professional profile.
            </p>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="neon-button group text-lg py-3 px-8"
              >
                <span className="flex items-center">
                  REGISTER_NOW
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}