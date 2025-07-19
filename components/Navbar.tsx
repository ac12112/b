"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import MobileMenu from "./MobileMenu";
import { ThemeToggle } from "./ui/theme-toggle";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full border-b border-white/5 dark:border-white/5 
                   bg-white/80 dark:bg-black/80 backdrop-blur-xl z-50 
                   light:bg-white/90 light:border-gray-200/20"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Brand */}
        <motion.div 
  className="flex items-center space-x-3"
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.2 }}
>
  <Link 
    href="/" 
    className="flex items-center space-x-3 group transition-all"
  >
    <motion.div 
      className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#07D348] to-[#24fe41] 
               flex items-center justify-center shadow-[0_0_20px_-5px_#07D348] 
               transition-transform group-hover:scale-105"
      whileHover={{ 
        boxShadow: "0 0 30px -5px #07D348",
        rotate: [0, -5, 5, 0]
      }}
      transition={{ duration: 0.3 }}
    >
      <svg
        className="h-5 w-5 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    </motion.div>
    <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 
                   dark:from-white dark:to-gray-300 bg-clip-text text-transparent
                   light:from-gray-900 light:to-gray-700">
      CivicSafe
    </span>
  </Link>
</motion.div>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                ['Submit Report', '/submit-report'],
                ['Track Report', '/track-report'],
                ['User Guide', '/how-it-works'],
                ['Community', '/community'],
                ['Emergency Contacts', '/emergency-contacts'],
              ].map(([name, href], index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={href}
                    className="relative text-sm text-gray-600 dark:text-zinc-300 light:text-gray-700
                             hover:text-gray-900 dark:hover:text-white light:hover:text-gray-900
                             transition-all group font-medium"
                  >
                    {name}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r 
                                   from-[#07D348] to-[#24fe41] transition-all group-hover:w-full"></span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Link
                  href="/contact"
                  className="hidden md:block text-sm text-gray-600 dark:text-zinc-300 light:text-gray-700
                           hover:text-gray-900 dark:hover:text-white light:hover:text-gray-900
                           transition-colors relative group font-medium"
                >
                  Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r 
                                 from-[#07D348] to-[#24fe41] transition-all group-hover:w-full"></span>
                </Link>
              </motion.div>

              <ThemeToggle />

              <motion.button 
                className="group relative flex items-center gap-2 rounded-full bg-gradient-to-br 
                         from-red-500 to-rose-600 pl-4 pr-5 py-2 text-sm font-medium text-white 
                         shadow-lg shadow-red-500/20 transition-all hover:shadow-red-500/30 
                         hover:scale-[1.02]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-br opacity-0 
                               transition-opacity group-hover:opacity-100 from-red-600 to-rose-700 -z-10" />
                <motion.span 
                  className="h-2 w-2 rounded-full bg-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
                Emergency: 999
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                className="md:hidden p-2 text-gray-600 dark:text-zinc-300 light:text-gray-700
                         hover:text-gray-900 dark:hover:text-white light:hover:text-gray-900
                         transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 
                         light:hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="space-y-1.5">
                  <motion.span 
                    className="block w-6 h-[2px] bg-current transition-transform origin-center"
                    animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 6 : 0 }}
                  />
                  <motion.span 
                    className="block w-6 h-[2px] bg-current"
                    animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                  />
                  <motion.span 
                    className="block w-6 h-[2px] bg-current transition-transform origin-center"
                    animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -6 : 0 }}
                  />
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}