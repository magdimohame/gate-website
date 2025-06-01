'use client';

import React, { useState, useMemo, useEffect, ReactNode, useRef } from 'react';
import {
  Users,
  Boxes,
  Truck,
  UserRound,
  BarChart2,
  PhoneCall,
  TrendingUp,
  ClipboardList,
  Scale,
  GraduationCap,
  Settings,
  Sun,
  Moon,
} from 'lucide-react';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import {
  FiSearch,
  FiX,
  FiGrid,
  FiList,
  FiChevronDown,
  FiSettings,
  FiSun,
  FiMoon,
  FiFilter,
  FiArrowRight,
  FiZap
} from 'react-icons/fi';
import { gsap } from 'gsap';

interface Website {
  id: number;
  name: string;
  description: string;
  url: string;
  icon: ReactNode;
  category: string;
  lastAccessed?: string;
  isRecommended?: boolean;
}

type SortOption = 'name' | 'category' | 'lastAccessed';
type ViewMode = 'grid' | 'list';
type NotificationType = 'success' | 'error' | 'info';

const initialWebsites: Website[] = [
  {
    id: 1,
    name: 'CRM',
    description: 'Customer relationship management system for sales and support.',
    url: 'https://crm-ecru-pi.vercel.app/',
    icon: <Users className="w-8 h-8" />,
    category: 'sales',
    lastAccessed: '2024-01-15',
    isRecommended: true,
  },
  {
    id: 2,
    name: 'Inventory',
    description: 'Comprehensive stock and warehouse management system.',
    url: 'https://inventory-green-xi.vercel.app/',
    icon: <Boxes className="w-8 h-8" />,
    category: 'operations',
    lastAccessed: '2024-01-14',
    isRecommended: true,
  },
  {
    id: 3,
    name: 'Web-Delivery',
    description: 'Online order fulfillment and logistics tracking system.',
    url: 'https://web-delivery-chi.vercel.app/',
    icon: <Truck className="w-8 h-8" />,
    category: 'operations',
    lastAccessed: '2024-01-13',
    isRecommended: true,
  },
  {
    id: 4,
    name: 'HR Portal',
    description: 'Human Resources information, payroll, and benefits management. Currently under development.',
    url: '#',
    icon: <UserRound className="w-8 h-8" />,
    category: 'hr',
    lastAccessed: undefined,
  },
];

const sortOptions = [
  { value: 'name' as SortOption, label: 'Name' },
  { value: 'category' as SortOption, label: 'Category' },
  { value: 'lastAccessed' as SortOption, label: 'Last Accessed' },
];

const categories = ['all', 'sales', 'operations', 'hr'];

// Enhanced Animated Button Component
const AnimatedButton: React.FC<{
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'disabled';
  className?: string;
  icon?: ReactNode;
}> = ({ children, onClick, href, variant = 'primary', className = '', icon }) => {
  const buttonRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseEnter = () => {
      setIsHovered(true);
      button.style.transform = 'scale(1.05)';
      button.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

      // Animate the icon if present
      const iconElement = button.querySelector('.button-icon');
      if (iconElement) {
        (iconElement as HTMLElement).style.transform = 'translateX(5px)';
        (iconElement as HTMLElement).style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }

      // Create ripple effect
      const ripple = document.createElement('div');
      ripple.className = 'absolute inset-0 rounded-full bg-white/20 scale-0 transition-transform duration-600 ease-out';
      button.appendChild(ripple);

      setTimeout(() => {
        ripple.style.transform = 'scale(1)';
        setTimeout(() => ripple.remove(), 600);
      }, 10);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      button.style.transform = 'scale(1)';

      const iconElement = button.querySelector('.button-icon');
      if (iconElement) {
        (iconElement as HTMLElement).style.transform = 'translateX(0)';
      }
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const baseClasses = `
    relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3
    rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-4
    transform-gpu will-change-transform ${className}
  `;

  const variantClasses = {
    primary: `bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg
              hover:shadow-xl focus:ring-indigo-300 border border-indigo-500/20`,
    secondary: `bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 shadow-md
                hover:shadow-lg focus:ring-gray-300 border border-gray-300/40`,
    disabled: `bg-gradient-to-r from-gray-400 to-gray-500 text-gray-200 cursor-not-allowed
               shadow-md border border-gray-400/40`
  };

  const Component = href ? 'a' : 'button';
  const props = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : { onClick };

  return (
    <Component
      ref={buttonRef as any}
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {icon && (
        <span className="button-icon relative z-10 transition-transform duration-300">
          {icon}
        </span>
      )}

      {/* Animated background gradient */}
      <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      } ${variant === 'primary'
        ? 'bg-gradient-to-r from-indigo-500 to-indigo-600'
        : variant === 'secondary'
        ? 'bg-gradient-to-r from-gray-200 to-gray-300'
        : 'bg-gradient-to-r from-gray-500 to-gray-600'
      }`} />
    </Component>
  );
};

// Notification Component
const Notification: React.FC<{ message: string; type: NotificationType }> = ({ message, type }) => (
  <motion.div
    initial={{ opacity: 0, y: -50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -50, scale: 0.9 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl backdrop-blur-lg border text-white font-semibold ${
      type === 'success'
        ? 'bg-green-500/90 border-green-400/50'
        : type === 'error'
        ? 'bg-red-500/90 border-red-400/50'
        : 'bg-blue-500/90 border-blue-400/50'
    }`}
  >
    <div className="flex items-center gap-2">
      <FiZap className="w-4 h-4" />
      {message}
    </div>
  </motion.div>
);

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteWebsiteIds, setFavoriteWebsiteIds] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<NotificationType>('info');

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Notification effect
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  // Click outside handler for settings and sort dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Close settings panel if clicking outside
      if (showSettings && !target.closest('[data-settings-panel]') && !target.closest('[data-settings-button]')) {
        setShowSettings(false);
      }

      // Close sort dropdown if clicking outside
      if (showSortDropdown && !target.closest('[data-sort-dropdown]') && !target.closest('[data-sort-button]')) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSettings, showSortDropdown]);

  // Escape key handler
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSettings(false);
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  const showNotificationMessage = (message: string, type: NotificationType = 'info') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  };

  const toggleFavorite = (id: number) => {
    const website = initialWebsites.find(w => w.id === id);
    const isFavorite = favoriteWebsiteIds.includes(id);

    setFavoriteWebsiteIds((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );

    showNotificationMessage(
      `${website?.name} ${isFavorite ? 'removed from' : 'added to'} favorites`,
      'success'
    );
  };

  const filteredWebsites = useMemo(() => {
    let filtered = initialWebsites;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.name.toLowerCase().includes(term) ||
          w.description.toLowerCase().includes(term) ||
          w.category.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter((w) => w.category === activeCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'lastAccessed':
          return new Date(b.lastAccessed || '').getTime() - new Date(a.lastAccessed || '').getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, activeCategory, sortBy]);

  const recommendedWebsites = useMemo(
    () => filteredWebsites.filter((w) => w.isRecommended && !favoriteWebsiteIds.includes(w.id)),
    [filteredWebsites, favoriteWebsiteIds]
  );

  const favoriteFilteredWebsites = useMemo(
    () => filteredWebsites.filter((w) => favoriteWebsiteIds.includes(w.id)),
    [filteredWebsites, favoriteWebsiteIds]
  );

  const nonFavoriteFilteredWebsites = useMemo(
    () => filteredWebsites.filter((w) => !favoriteWebsiteIds.includes(w.id) && !w.isRecommended),
    [filteredWebsites, favoriteWebsiteIds]
  );

  const WebsiteCard: React.FC<{
    website: Website;
    isFavorite: boolean;
    onToggleFavorite: (id: number) => void;
    index: number;
  }> = ({ website, isFavorite, onToggleFavorite, index }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true });

    useEffect(() => {
      if (cardRef.current) {
        const card = cardRef.current;
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) rotateX(0deg) scale(1)';
      }
    }, []);

    useEffect(() => {
      const card = cardRef.current;
      const icon = iconRef.current;
      if (!card || !icon) return;

      const handleMouseEnter = () => {
        card.style.transform = 'translateY(-8px) rotateY(2deg) rotateX(2deg)';
        card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.boxShadow = isDarkMode
          ? '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(99, 102, 241, 0.3), 0 0 20px rgba(99, 102, 241, 0.2)'
          : '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(99, 102, 241, 0.2), 0 0 20px rgba(99, 102, 241, 0.1)';

        icon.style.transform = 'scale(1.1) rotate(5deg)';
        icon.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      };

      const handleMouseLeave = () => {
        card.style.transform = 'translateY(0) rotateY(0deg) rotateX(0deg)';
        card.style.boxShadow = isDarkMode
          ? isFavorite
            ? '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(99, 102, 241, 0.2)'
            : '0 8px 24px rgba(0,0,0,0.2)'
          : isFavorite
            ? '0 8px 24px rgba(99, 102, 241, 0.15)'
            : '0 8px 16px rgba(0,0,0,0.1)';

        icon.style.transform = 'scale(1) rotate(0deg)';
      };

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, [isDarkMode, isFavorite]);

    return (
      <div
        ref={cardRef}
        className={`relative rounded-2xl p-6 flex flex-col justify-between border backdrop-blur-lg transition-all duration-300 min-h-[320px] transform-gpu will-change-transform
          ${isFavorite
            ? isDarkMode
              ? 'border-indigo-400/60 bg-gradient-to-br from-gray-800/90 to-gray-900/90'
              : 'border-indigo-400/60 bg-gradient-to-br from-white/80 to-indigo-50/80'
            : isDarkMode
              ? 'border-gray-600/40 bg-gradient-to-br from-gray-800/80 to-gray-900/80'
              : 'border-white/40 bg-gradient-to-br from-white/60 to-gray-50/60'
          }`}
        role="region"
        aria-labelledby={`site-title-${website.id}`}
      >
      {website.isRecommended && (
        <div className={`absolute top-2 left-2 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg ${
          isDarkMode
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/30'
            : 'bg-gradient-to-r from-green-500 to-green-600 shadow-green-500/20'
        }`}>
          Recommended
        </div>
      )}

      <button
        onClick={() => onToggleFavorite(website.id)}
        className={`absolute top-4 right-4 text-2xl p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${
          isFavorite
            ? isDarkMode
              ? 'text-yellow-400 hover:text-yellow-300 bg-yellow-400/10 hover:bg-yellow-400/20'
              : 'text-yellow-500 hover:text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
            : isDarkMode
              ? 'text-gray-400 hover:text-gray-200 bg-gray-700/50 hover:bg-gray-600/50'
              : 'text-gray-400 hover:text-gray-600 bg-gray-100/50 hover:bg-gray-200/50'
        }`}
        aria-label={isFavorite ? `Unfavorite ${website.name}` : `Favorite ${website.name}`}
      >
        {isFavorite ? '★' : '☆'}
      </button>

        <div className="flex items-center space-x-4 mb-6">
          <div
            ref={iconRef}
            className={`flex-shrink-0 p-4 rounded-2xl shadow-lg transition-all duration-300 transform-gpu will-change-transform ${
              isDarkMode
                ? 'bg-gradient-to-br from-indigo-600/90 to-indigo-700/90 text-indigo-100 shadow-indigo-500/30'
                : 'bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 shadow-indigo-300/50'
            }`}
          >
            {website.icon}
          </div>
          <div className="flex-1">
            <motion.h2
              id={`site-title-${website.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-2xl font-bold transition-colors duration-300 mb-2 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`}
            >
              {website.name}
            </motion.h2>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`inline-block text-sm capitalize px-3 py-1 rounded-full font-medium transition-all duration-300 ${
                isDarkMode
                  ? 'text-indigo-300 bg-indigo-900/50 border border-indigo-700/50'
                  : 'text-indigo-700 bg-indigo-100/80 border border-indigo-200/50'
              }`}
            >
              {website.category}
            </motion.span>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mb-6 leading-relaxed flex-grow transition-colors duration-300 text-base ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          {website.description}
        </motion.p>

        {website.lastAccessed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-xs mb-4 transition-colors duration-300 flex items-center gap-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              isDarkMode ? 'bg-green-400' : 'bg-green-500'
            }`} />
            Last accessed: {new Date(website.lastAccessed).toLocaleDateString()}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {website.url === '#' ? (
            <AnimatedButton variant="disabled">
              Under Development
            </AnimatedButton>
          ) : (
            <AnimatedButton
              href={website.url}
              variant="primary"
              icon={<FiArrowRight className="w-4 h-4" />}
            >
              Access System
            </AnimatedButton>
          )}
        </motion.div>
      </div>
    );
  };

  return (
    <div className={`relative min-h-screen overflow-x-hidden transition-colors duration-500 p-6 sm:p-10 lg:p-16 ${
      isDarkMode
        ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900'
        : 'bg-gradient-to-br from-indigo-100 via-sky-100 to-purple-200'
    }`}>
      {/* Enhanced floating gradient blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`pointer-events-none select-none absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl ${
          isDarkMode
            ? 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-600 opacity-20'
            : 'bg-gradient-to-tr from-purple-400 via-indigo-400 to-sky-400 opacity-30'
        }`}
        style={{
          animation: 'blob 20s infinite, float 6s ease-in-out infinite'
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`pointer-events-none select-none absolute bottom-0 -right-32 w-96 h-96 rounded-full blur-3xl ${
          isDarkMode
            ? 'bg-gradient-to-br from-indigo-500 via-sky-500 to-purple-500 opacity-15'
            : 'bg-gradient-to-br from-indigo-300 via-sky-300 to-purple-300 opacity-20'
        }`}
        style={{
          animation: 'blob 25s infinite reverse, float 8s ease-in-out infinite 2s'
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`pointer-events-none select-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl ${
          isDarkMode
            ? 'bg-gradient-to-tr from-sky-600 via-purple-600 to-indigo-600 opacity-10'
            : 'bg-gradient-to-tr from-sky-300 via-purple-300 to-indigo-300 opacity-15'
        }`}
        style={{
          animation: 'blob 30s infinite, float 10s ease-in-out infinite 4s'
        }}
      />

      {/* Additional floating elements */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`pointer-events-none absolute w-4 h-4 rounded-full blur-sm ${
            isDarkMode ? 'bg-indigo-400/20' : 'bg-indigo-600/15'
          }`}
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 30}%`,
            animation: `float ${4 + i}s ease-in-out infinite ${i * 0.5}s`
          }}
        />
      ))}

      {/* Header */}
      <header className={`relative max-w-7xl mx-auto mb-14 text-center py-12 rounded-2xl shadow-lg backdrop-blur-xl border transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gray-800/40 border-gray-700/30'
          : 'bg-white/40 border-white/30'
      }`}>
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              isDarkMode
                ? 'text-yellow-400 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-indigo-100'
            }`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <FiSun className="w-6 h-6" /> : <FiMoon className="w-6 h-6" />}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            data-settings-button
            className={`p-2 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              isDarkMode
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-indigo-100'
            }`}
            aria-label="Settings"
            aria-expanded={showSettings}
          >
            <FiSettings className="w-6 h-6" />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight ${
              isDarkMode ? 'text-gray-100' : 'text-indigo-800'
            }`}
          >
            Welcome to Your{' '}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`inline-block ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
            >
              Employee Gateway
            </motion.span>
          </motion.h1>

          {/* Animated underline */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            className={`h-1 mx-auto mb-6 rounded-full ${
              isDarkMode
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600'
            }`}
            style={{ maxWidth: '200px' }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-lg sm:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          Your central hub for quick and secure access to all essential internal systems and tools.
        </motion.p>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`absolute w-2 h-2 rounded-full ${
                isDarkMode ? 'bg-indigo-400/30' : 'bg-indigo-600/20'
              }`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`
              }}
            />
          ))}
        </div>
      </header>

      {/* SETTINGS PANEL */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-settings-panel
            className={`fixed top-20 right-6 z-40 p-6 rounded-xl shadow-xl backdrop-blur-xl border max-w-sm w-full ${
              isDarkMode
                ? 'bg-gray-800/90 border-gray-700/50'
                : 'bg-white/90 border-white/50'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className={`p-1 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                }`}
                aria-label="Close settings"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Sort by
                </label>
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  data-sort-button
                  aria-haspopup="listbox"
                  aria-expanded={showSortDropdown}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                    isDarkMode
                      ? 'bg-indigo-800 hover:bg-indigo-700'
                      : 'bg-indigo-100 hover:bg-indigo-200'
                  }`}
                >
                  <span>Sort by: {sortOptions.find(o => o.value === sortBy)?.label}</span>
                  <FiChevronDown className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {showSortDropdown && (
                    <motion.ul
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      data-sort-dropdown
                      role="listbox"
                      tabIndex={-1}
                      className={`absolute z-10 mt-1 w-full rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      {sortOptions.map((option) => (
                        <li
                          key={option.value}
                          role="option"
                          aria-selected={sortBy === option.value}
                          tabIndex={0}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortDropdown(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              setSortBy(option.value);
                              setShowSortDropdown(false);
                            }
                          }}
                          className={`cursor-pointer select-none px-4 py-2 hover:bg-indigo-500 hover:text-white focus:bg-indigo-500 focus:text-white ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          } ${sortBy === option.value ? 'font-semibold' : ''}`}
                        >
                          {option.label}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ENHANCED SEARCH & FILTER */}
      <div className="mb-12 max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="relative mb-8 max-w-3xl mx-auto group">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`relative rounded-2xl shadow-xl backdrop-blur-xl border transition-all duration-300 ${
              isDarkMode
                ? 'bg-gray-800/60 border-gray-600/40 shadow-gray-900/50'
                : 'bg-white/60 border-white/40 shadow-gray-200/50'
            } group-focus-within:shadow-2xl ${
              isDarkMode
                ? 'group-focus-within:shadow-indigo-500/20 group-focus-within:border-indigo-400/60'
                : 'group-focus-within:shadow-indigo-200/50 group-focus-within:border-indigo-300/60'
            }`}
          >
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-14 h-14 rounded-l-2xl transition-colors duration-300 ${
                isDarkMode
                  ? 'bg-indigo-600/20 text-indigo-400'
                  : 'bg-indigo-50 text-indigo-600'
              } group-focus-within:${isDarkMode ? 'bg-indigo-500/30' : 'bg-indigo-100'}`}>
                <FiSearch className="w-6 h-6" />
              </div>

              <input
                type="text"
                placeholder="Search systems by name, description, or category..."
                className={`flex-1 p-4 text-lg bg-transparent border-none outline-none placeholder-opacity-70 transition-all duration-300 ${
                  isDarkMode
                    ? 'text-gray-200 placeholder-gray-400'
                    : 'text-gray-800 placeholder-gray-500'
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search systems by name, description, or category"
              />

              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSearchTerm('')}
                    className={`mr-4 p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                      isDarkMode
                        ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                    }`}
                    aria-label="Clear search term"
                  >
                    <FiX className="w-5 h-5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Search Results Count */}
            <AnimatePresence>
              {searchTerm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`px-4 pb-3 text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {filteredWebsites.length} system{filteredWebsites.length !== 1 ? 's' : ''} found
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Category Filters */}
          <div className="flex-1">
            <motion.fieldset
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-3"
              aria-label="Filter systems by category"
            >
              {categories.map((cat, index) => (
                <motion.label
                  key={cat}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`cursor-pointer select-none px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeCategory === cat
                      ? isDarkMode
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/30'
                        : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/20'
                      : isDarkMode
                        ? 'bg-gray-700/60 text-gray-300 hover:bg-indigo-600/80 hover:text-white border border-gray-600/40'
                        : 'bg-white/60 text-gray-700 hover:bg-indigo-600/90 hover:text-white border border-gray-300/40'
                  } backdrop-blur-sm`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={activeCategory === cat}
                    onChange={() => setActiveCategory(cat)}
                    className="sr-only"
                  />
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </motion.label>
              ))}
            </motion.fieldset>
          </div>

          {/* View Mode Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              View:
            </span>
            <div className={`flex items-center rounded-xl p-1 transition-colors duration-300 ${
              isDarkMode
                ? 'bg-gray-700/60 border border-gray-600/40'
                : 'bg-white/60 border border-gray-300/40'
            } backdrop-blur-sm`}>
              <button
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                className={`p-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  viewMode === 'grid'
                    ? isDarkMode
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-indigo-600 text-white shadow-md'
                    : isDarkMode
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-600/50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/50'
                }`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                aria-label="List view"
                className={`p-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  viewMode === 'list'
                    ? isDarkMode
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-indigo-600 text-white shadow-md'
                    : isDarkMode
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-600/50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/50'
                }`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RECOMMENDED SYSTEMS */}
      {recommendedWebsites.length > 0 && (
        <section className="mb-16 max-w-7xl mx-auto" aria-labelledby="recommended-heading">
          <h2 className={`text-3xl font-bold mb-6 border-b-2 pb-3 ${
            isDarkMode ? 'text-indigo-400 border-indigo-600' : 'text-indigo-700 border-indigo-300'
          }`}>
            Recommended for You
          </h2>
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8' : 'flex flex-col gap-6'}`}>
            {recommendedWebsites.map((website, idx) => (
              <WebsiteCard
                key={website.id}
                website={website}
                isFavorite={false}
                onToggleFavorite={toggleFavorite}
                index={idx}
              />
            ))}
          </div>
        </section>
      )}

      {/* FAVORITES */}
      {favoriteFilteredWebsites.length > 0 && (
        <section className="mb-16 max-w-7xl mx-auto" aria-labelledby="favorites-heading">
          <h2
            id="favorites-heading"
            className={`text-4xl font-bold mb-10 border-b-4 pb-5 ${
              isDarkMode ? 'text-indigo-400 border-indigo-600' : 'text-indigo-700 border-indigo-300'
            }`}
          >
            Your Favorite Systems
          </h2>
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8' : 'flex flex-col gap-6'}`}>
            {favoriteFilteredWebsites.map((website, idx) => (
              <WebsiteCard
                key={website.id}
                website={website}
                isFavorite
                onToggleFavorite={toggleFavorite}
                index={idx}
              />
            ))}
          </div>
        </section>
      )}

      {/* ALL SYSTEMS */}
      <section aria-labelledby="all-systems-heading" className="max-w-7xl mx-auto">
        <h2
          id="all-systems-heading"
          className={`text-4xl font-bold mb-10 border-b-4 pb-5 ${
            isDarkMode ? 'text-indigo-400 border-indigo-600' : 'text-indigo-700 border-indigo-300'
          }`}
        >
          All Available Systems
        </h2>
        {nonFavoriteFilteredWebsites.length > 0 ? (
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8' : 'flex flex-col gap-6'}`}>
            {nonFavoriteFilteredWebsites.map((website, idx) => (
              <WebsiteCard
                key={website.id}
                website={website}
                isFavorite={false}
                onToggleFavorite={toggleFavorite}
                index={idx}
              />
            ))}
          </div>
        ) : searchTerm ? (
          <p className={`text-center py-16 text-xl ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            No systems match &quot;<span className={`font-semibold ${
              isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
            }`}>{searchTerm}</span>&quot;. Try a different keyword.
          </p>
        ) : (
          <p className={`text-center py-16 text-xl ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>No systems available.</p>
        )}
      </section>

      {/* NOTIFICATION */}
      {showNotification && <Notification message={notificationMessage} type={notificationType} />}

      {/* ENHANCED STYLES */}
      <style jsx global>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1) rotate(0deg);
          }
          25% {
            transform: translate(30px, -50px) scale(1.1) rotate(90deg);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9) rotate(180deg);
          }
          75% {
            transform: translate(-30px, -20px) scale(1.05) rotate(270deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(99, 102, 241, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.6), 0 0 30px rgba(99, 102, 241, 0.4);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0.3) rotate(-10deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.05) rotate(5deg);
          }
          70% {
            transform: scale(0.9) rotate(-2deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-blob {
          animation: blob 18s infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        html.dark {
          background-color: #0f172a;
          color-scheme: dark;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }

        /* Smooth focus transitions */
        * {
          transition: box-shadow 0.2s ease;
        }
      `}</style>
    </div>
  );
}
