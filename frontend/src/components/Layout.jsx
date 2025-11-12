import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Target,
  BarChart3,
  Settings,
  Menu,
  X,
  Zap
} from 'lucide-react';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl md:hidden"
            >
              <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center space-x-2">
                  <div className="rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 p-2">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">Goal Manager</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-md p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <SidebarContent currentPath={location.pathname} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 p-2">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Goal Manager</h1>
                <p className="text-sm text-gray-500">Track & Achieve</p>
              </div>
            </div>
          </div>
          <SidebarContent currentPath={location.pathname} />
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        {/* Top bar for mobile */}
        <div className="sticky top-0 z-30 flex h-16 items-center bg-white px-4 shadow-sm md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 text-gray-400 hover:text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-4 flex items-center space-x-2">
            <div className="rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 p-1.5">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Goal Manager</span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 md:p-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ currentPath }) {
  return (
    <nav className="mt-6 flex-1 space-y-2 px-4">
      {navigation.map((item) => {
        const isActive = currentPath === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={clsx(
              'group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-primary-50 text-primary-700 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <item.icon
              className={clsx(
                'mr-3 h-5 w-5 transition-colors duration-200',
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-400 group-hover:text-gray-600'
              )}
            />
            {item.name}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute left-0 w-1 bg-primary-600 rounded-r-full h-8"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}