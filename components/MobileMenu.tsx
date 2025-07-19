"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme-context";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { theme } = useTheme();

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: "0%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  const backdropVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      x: 50
    },
    open: {
      opacity: 1,
      x: 0
    }
  };

  const containerVariants = {
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <motion.div
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Menu content */}
            <motion.div
              className="fixed right-0 top-0 h-full w-80 bg-white/95 dark:bg-zinc-900/95 
                         light:bg-white/98 backdrop-blur-xl shadow-2xl border-l 
                         border-gray-200/30 dark:border-white/10 light:border-gray-300/30"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <motion.div 
                className="flex flex-col h-full p-6"
                variants={containerVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {/* Header */}
                <motion.div 
                  className="flex justify-between items-center mb-8"
                  variants={itemVariants}
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#07D348] to-[#24fe41] 
                                   flex items-center justify-center shadow-lg">
                      <svg
                        className="h-4 w-4 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z"
                        />
                      </svg>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white light:text-gray-900">
                      CivicSafe
                    </span>
                  </div>
                  <motion.button
                    onClick={onClose}
                    className="p-2 text-gray-600 dark:text-zinc-400 light:text-gray-600 
                             hover:text-gray-900 dark:hover:text-white light:hover:text-gray-900
                             hover:bg-gray-100 dark:hover:bg-white/10 light:hover:bg-gray-100 
                             rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </motion.div>

                {/* Navigation */}
                <motion.nav className="flex flex-col space-y-2 flex-1">
                  {[
                    { name: "Submit Report", href: "/submit-report", icon: "📝" },
                    { name: "Track Report", href: "/track-report", icon: "📍" },
                    { name: "User Guide", href: "/how-it-works", icon: "📖" },
                    { name: "Community", href: "/community", icon: "👥" },
                    { name: "Emergency Contacts", href: "/emergency-contacts", icon: "📞" },
                  ].map((item, index) => (
                    <motion.div
                      key={item.name}
                      variants={itemVariants}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center space-x-3 p-4 rounded-xl text-gray-700 dark:text-zinc-300 
                                 light:text-gray-700 hover:text-gray-900 dark:hover:text-white 
                                 light:hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-white/10 
                                 light:hover:bg-gray-100 transition-all group"
                        onClick={onClose}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                        <motion.svg
                          className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          whileHover={{ x: 5 }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </motion.svg>
                      </Link>
                    </motion.div>
                  ))}
                </motion.nav>

                {/* Emergency Button */}
                <motion.div 
                  className="mt-auto"
                  variants={itemVariants}
                >
                  <motion.button 
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r 
                             from-red-500 to-rose-600 p-4 text-sm font-medium text-white 
                             shadow-lg hover:shadow-red-500/30 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.span 
                      className="h-2 w-2 rounded-full bg-white"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                    Emergency: 999
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}