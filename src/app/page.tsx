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
  Bell,
  Search,
  Menu,
  X,
  Plus,
  Activity,
  Clock,
  Shield,
  Zap,
  Globe,
  Database,
  Cpu,
  Wifi,
  AlertCircle,
  CheckCircle,
  Calendar,
  User,
  LogOut,
  Bookmark,
  Star,
  Filter,
  Grid,
  List,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Maximize2,
  MoreHorizontal,
  RefreshCw,
  Download,
  Upload,
  Share2,
  Heart,
  Eye,
  MessageSquare,
  Layers,
  Command,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Website {
  id: number;
  name: string;
  description: string;
  url: string;
  icon: ReactNode;
  category: string;
  lastAccessed?: string;
  isRecommended?: boolean;
  status: 'active' | 'maintenance' | 'development' | 'offline';
  usage: number; // percentage
  uptime: number; // percentage
  users: number;
  version?: string;
  tags?: string[];
}

interface QuickAction {
  id: string;
  name: string;
  icon: ReactNode;
  action: () => void;
  color: string;
}

interface SystemMetric {
  id: string;
  name: string;
  value: string;
  change: number;
  icon: ReactNode;
  color: string;
}

interface Activity {
  id: string;
  user: string;
  action: string;
  system: string;
  timestamp: string;
  type: 'login' | 'update' | 'error' | 'success';
}

type SortOption = 'name' | 'category' | 'lastAccessed' | 'usage' | 'status';
type ViewMode = 'grid' | 'list' | 'compact';
type NotificationType = 'success' | 'error' | 'info' | 'warning';

const initialWebsites: Website[] = [
  {
    id: 1,
    name: 'CRM System',
    description: 'Advanced customer relationship management with AI-powered insights and automated workflows.',
    url: 'https://crm-ecru-pi.vercel.app/',
    icon: <Users className="w-6 h-6" />,
    category: 'sales',
    lastAccessed: '2024-01-15',
    isRecommended: true,
    status: 'active',
    usage: 87,
    uptime: 99.8,
    users: 142,
    version: '2.4.1',
    tags: ['CRM', 'Sales', 'Analytics']
  },
  {
    id: 2,
    name: 'Inventory Hub',
    description: 'Real-time inventory tracking with predictive analytics and automated reordering.',
    url: 'https://inventory-green-xi.vercel.app/',
    icon: <Boxes className="w-6 h-6" />,
    category: 'operations',
    lastAccessed: '2024-01-14',
    isRecommended: true,
    status: 'active',
    usage: 92,
    uptime: 99.9,
    users: 89,
    version: '3.1.0',
    tags: ['Inventory', 'Warehouse', 'Automation']
  },
  {
    id: 3,
    name: 'Delivery Network',
    description: 'Smart logistics platform with route optimization and real-time tracking.',
    url: 'https://web-delivery-chi.vercel.app/',
    icon: <Truck className="w-6 h-6" />,
    category: 'operations',
    lastAccessed: '2024-01-13',
    isRecommended: true,
    status: 'active',
    usage: 78,
    uptime: 99.5,
    users: 67,
    version: '1.8.3',
    tags: ['Logistics', 'Delivery', 'Tracking']
  },
  {
    id: 4,
    name: 'HR Central',
    description: 'Comprehensive human resources platform with employee self-service and analytics.',
    url: '#',
    icon: <UserRound className="w-6 h-6" />,
    category: 'hr',
    lastAccessed: undefined,
    status: 'development',
    usage: 0,
    uptime: 0,
    users: 0,
    version: '0.9.0-beta',
    tags: ['HR', 'Payroll', 'Benefits']
  },
  {
    id: 5,
    name: 'Analytics Dashboard',
    description: 'Business intelligence platform with real-time reporting and data visualization.',
    url: '#',
    icon: <BarChart2 className="w-6 h-6" />,
    category: 'analytics',
    lastAccessed: '2024-01-12',
    isRecommended: false,
    status: 'active',
    usage: 65,
    uptime: 98.7,
    users: 34,
    version: '2.0.1',
    tags: ['Analytics', 'Reports', 'BI']
  },
  {
    id: 6,
    name: 'Security Center',
    description: 'Centralized security monitoring and access control management system.',
    url: '#',
    icon: <Shield className="w-6 h-6" />,
    category: 'security',
    lastAccessed: '2024-01-11',
    isRecommended: false,
    status: 'active',
    usage: 45,
    uptime: 99.9,
    users: 12,
    version: '1.5.2',
    tags: ['Security', 'Access', 'Monitoring']
  }
];

const sortOptions = [
  { value: 'name' as SortOption, label: 'Name' },
  { value: 'category' as SortOption, label: 'Category' },
  { value: 'lastAccessed' as SortOption, label: 'Last Accessed' },
  { value: 'usage' as SortOption, label: 'Usage' },
  { value: 'status' as SortOption, label: 'Status' },
];

const categories = ['all', 'sales', 'operations', 'hr', 'analytics', 'security'];

const quickActions: QuickAction[] = [
  {
    id: 'search',
    name: 'Global Search',
    icon: <Search className="w-5 h-5" />,
    action: () => console.log('Search'),
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: <Bell className="w-5 h-5" />,
    action: () => console.log('Notifications'),
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'support',
    name: 'Help & Support',
    icon: <MessageSquare className="w-5 h-5" />,
    action: () => console.log('Support'),
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'settings',
    name: 'System Settings',
    icon: <Settings className="w-5 h-5" />,
    action: () => console.log('Settings'),
    color: 'from-orange-500 to-red-500'
  }
];

const systemMetrics: SystemMetric[] = [
  {
    id: 'total-users',
    name: 'Active Users',
    value: '344',
    change: 12.5,
    icon: <Users className="w-5 h-5" />,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'system-uptime',
    name: 'System Uptime',
    value: '99.8%',
    change: 0.2,
    icon: <Activity className="w-5 h-5" />,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'data-processed',
    name: 'Data Processed',
    value: '2.4TB',
    change: 8.7,
    icon: <Database className="w-5 h-5" />,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'response-time',
    name: 'Avg Response',
    value: '120ms',
    change: -5.3,
    icon: <Zap className="w-5 h-5" />,
    color: 'from-orange-500 to-red-500'
  }
];

const recentActivities: Activity[] = [
  {
    id: '1',
    user: 'Sarah Chen',
    action: 'Updated customer records',
    system: 'CRM System',
    timestamp: '2 minutes ago',
    type: 'update'
  },
  {
    id: '2',
    user: 'Mike Johnson',
    action: 'Generated monthly report',
    system: 'Analytics Dashboard',
    timestamp: '15 minutes ago',
    type: 'success'
  },
  {
    id: '3',
    user: 'Emily Davis',
    action: 'Processed inventory batch',
    system: 'Inventory Hub',
    timestamp: '1 hour ago',
    type: 'success'
  },
  {
    id: '4',
    user: 'System',
    action: 'Backup completed successfully',
    system: 'Security Center',
    timestamp: '2 hours ago',
    type: 'success'
  },
  {
    id: '5',
    user: 'Alex Rodriguez',
    action: 'Login attempt failed',
    system: 'Security Center',
    timestamp: '3 hours ago',
    type: 'error'
  }
];

// Modern Navigation Component
const Navigation: React.FC<{
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}> = ({ isDarkMode, onToggleDarkMode, searchTerm, onSearchChange }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
        isDarkMode
          ? 'bg-gray-900/80 border-gray-700/50'
          : 'bg-white/80 border-gray-200/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <div className={`p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg`}>
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Gateway
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Employee Portal
              </p>
            </div>
          </motion.div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className={`relative transition-all duration-300 ${
              isSearchFocused ? 'scale-105' : 'scale-100'
            }`}>
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                isSearchFocused
                  ? 'text-blue-500'
                  : isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search systems, users, or actions..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-full pl-12 pr-4 py-3 rounded-2xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  isDarkMode
                    ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400'
                    : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500'
                }`}
              />
              {searchTerm && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => onSearchChange('')}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Right Actions - Empty for now */}
          <div className="flex items-center gap-3">
            {/* Placeholder for future actions */}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

// Metrics Card Component
const MetricsCard: React.FC<{
  metric: SystemMetric;
  isDarkMode: boolean;
  index: number;
}> = ({ metric, isDarkMode, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:scale-105 ${
        isDarkMode
          ? 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600'
          : 'bg-white/50 border-gray-200/50 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} text-white shadow-lg`}>
          {metric.icon}
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          metric.change >= 0 ? 'text-green-500' : 'text-red-500'
        }`}>
          {metric.change >= 0 ? '+' : ''}{metric.change}%
          <TrendingUp className={`w-4 h-4 ${metric.change < 0 ? 'rotate-180' : ''}`} />
        </div>
      </div>
      <div>
        <div className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {metric.value}
        </div>
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {metric.name}
        </div>
      </div>
    </motion.div>
  );
};

// Quick Action Button Component
const QuickActionButton: React.FC<{
  action: QuickAction;
  isDarkMode: boolean;
  index: number;
}> = ({ action, isDarkMode, index }) => {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={action.action}
      className={`p-4 rounded-2xl backdrop-blur-xl border transition-all duration-300 group ${
        isDarkMode
          ? 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600'
          : 'bg-white/50 border-gray-200/50 hover:border-gray-300'
      }`}
    >
      <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-lg mb-3 group-hover:shadow-xl transition-shadow`}>
        {action.icon}
      </div>
      <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {action.name}
      </div>
    </motion.button>
  );
};

// Activity Feed Component
const ActivityFeed: React.FC<{
  activities: Activity[];
  isDarkMode: boolean;
}> = ({ activities, isDarkMode }) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'login': return <User className="w-4 h-4" />;
      case 'update': return <RefreshCw className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'login': return 'from-blue-500 to-cyan-500';
      case 'update': return 'from-purple-500 to-pink-500';
      case 'error': return 'from-red-500 to-orange-500';
      case 'success': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className={`p-6 rounded-2xl backdrop-blur-xl border ${
      isDarkMode
        ? 'bg-gray-800/50 border-gray-700/50'
        : 'bg-white/50 border-gray-200/50'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Recent Activity
        </h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className={`p-2 rounded-lg bg-gradient-to-br ${getActivityColor(activity.type)} text-white shadow-md flex-shrink-0`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {activity.user}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {activity.action} in {activity.system}
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {activity.timestamp}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full mt-4 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
          isDarkMode
            ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white'
            : 'bg-gray-100/50 hover:bg-gray-100 text-gray-600 hover:text-gray-900'
        }`}
      >
        View All Activity
      </motion.button>
    </div>
  );
};


// Modern Notification Component
const Notification: React.FC<{ message: string; type: NotificationType }> = ({ message, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'error': return <AlertCircle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success': return 'from-green-500/90 to-emerald-500/90 border-green-400/50';
      case 'error': return 'from-red-500/90 to-rose-500/90 border-red-400/50';
      case 'warning': return 'from-amber-500/90 to-orange-500/90 border-amber-400/50';
      default: return 'from-blue-500/90 to-indigo-500/90 border-blue-400/50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`fixed top-24 right-6 z-50 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border text-white font-medium min-w-[320px] bg-gradient-to-r ${getColors()}`}
    >
      <div className="flex items-start gap-3">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
          className="p-2 rounded-full bg-white/20 flex-shrink-0"
        >
          {getIcon()}
        </motion.div>
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="font-semibold text-sm mb-1"
          >
            {type === 'success' ? 'Success!' : type === 'error' ? 'Error!' : type === 'warning' ? 'Warning!' : 'Info'}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm opacity-90"
          >
            {message}
          </motion.div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 4, ease: "linear" }}
        className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-2xl origin-left"
      />
    </motion.div>
  );
};

// Modern System Card Component
const SystemCard: React.FC<{
  website: Website;
  isDarkMode: boolean;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  index: number;
}> = ({ website, isDarkMode, isFavorite, onToggleFavorite, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: Website['status']) => {
    switch (status) {
      case 'active': return 'from-green-500 to-emerald-500';
      case 'maintenance': return 'from-amber-500 to-orange-500';
      case 'development': return 'from-blue-500 to-cyan-500';
      case 'offline': return 'from-red-500 to-rose-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusText = (status: Website['status']) => {
    switch (status) {
      case 'active': return 'Online';
      case 'maintenance': return 'Maintenance';
      case 'development': return 'Development';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative p-6 rounded-3xl backdrop-blur-xl border transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 ${
        isDarkMode
          ? 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/70'
          : 'bg-white/50 border-gray-200/50 hover:border-gray-300 hover:bg-white/70'
      } ${isFavorite ? 'ring-2 ring-blue-500/30' : ''}`}
    >
      {/* Background Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{ opacity: isHovered ? 1 : 0 }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`p-3 rounded-2xl bg-gradient-to-br ${getStatusColor(website.status)} text-white shadow-lg`}
          >
            {website.icon}
          </motion.div>
          <div>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {website.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium bg-gradient-to-r ${getStatusColor(website.status)} text-white`}>
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {getStatusText(website.status)}
              </span>
              {website.version && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  v{website.version}
                </span>
              )}
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onToggleFavorite(website.id)}
          className={`p-2 rounded-xl transition-all duration-300 ${
            isFavorite
              ? 'text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20'
              : isDarkMode
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
        >
          <motion.div
            animate={{ rotate: isFavorite ? [0, -10, 10, 0] : 0 }}
            transition={{ duration: 0.5 }}
          >
            {isFavorite ? <Star className="w-5 h-5 fill-current" /> : <Star className="w-5 h-5" />}
          </motion.div>
        </motion.button>
      </div>

      {/* Description */}
      <p className={`text-sm leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {website.description}
      </p>

      {/* Metrics */}
      {website.status === 'active' && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className={`text-center p-3 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
            <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {website.usage}%
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Usage
            </div>
          </div>
          <div className={`text-center p-3 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
            <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {website.uptime}%
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Uptime
            </div>
          </div>
          <div className={`text-center p-3 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
            <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {website.users}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Users
            </div>
          </div>
        </div>
      )}

      {/* Tags */}
      {website.tags && (
        <div className="flex flex-wrap gap-2 mb-6">
          {website.tags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className={`text-xs px-2 py-1 rounded-full ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Button */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        {website.url === '#' ? (
          <button
            disabled
            className={`w-full py-3 px-4 rounded-2xl font-medium transition-all duration-300 cursor-not-allowed ${
              isDarkMode
                ? 'bg-gray-700 text-gray-400 border border-gray-600'
                : 'bg-gray-100 text-gray-500 border border-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" />
              Under Development
            </div>
          </button>
        ) : (
          <a
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-3 px-4 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r ${getStatusColor(website.status)} text-white hover:shadow-lg hover:shadow-blue-500/25`}
          >
            <span>Access System</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </motion.div>

      {/* Last Accessed */}
      {website.lastAccessed && (
        <div className={`mt-4 text-xs flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <Clock className="w-3 h-3" />
          Last accessed {new Date(website.lastAccessed).toLocaleDateString()}
        </div>
      )}
    </motion.div>
  );
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteWebsiteIds, setFavoriteWebsiteIds] = useState<number[]>([1, 2]);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<NotificationType>('info');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax background elements
      gsap.to('.parallax-slow', {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to('.parallax-fast', {
        yPercent: -60,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Notification effect
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  // Click outside handler for filters
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showFilters && !target.closest('[data-filters-panel]') && !target.closest('[data-filters-button]')) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilters]);

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

  const handleQuickAction = (actionId: string) => {
    const action = quickActions.find(a => a.id === actionId);
    if (action) {
      action.action();
      showNotificationMessage(`${action.name} activated`, 'success');
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
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
          w.category.toLowerCase().includes(term) ||
          w.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter((w) => w.category === activeCategory);
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((w) =>
        w.tags?.some(tag => selectedTags.includes(tag))
      );
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
        case 'usage':
          return b.usage - a.usage;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, activeCategory, sortBy, selectedTags]);

  const favoriteWebsites = useMemo(
    () => filteredWebsites.filter((w) => favoriteWebsiteIds.includes(w.id)),
    [filteredWebsites, favoriteWebsiteIds]
  );

  const recommendedWebsites = useMemo(
    () => filteredWebsites.filter((w) => w.isRecommended && !favoriteWebsiteIds.includes(w.id)),
    [filteredWebsites, favoriteWebsiteIds]
  );

  const otherWebsites = useMemo(
    () => filteredWebsites.filter((w) => !favoriteWebsiteIds.includes(w.id) && !w.isRecommended),
    [filteredWebsites, favoriteWebsiteIds]
  );

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialWebsites.forEach(website => {
      website.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  // Get all unique tags for filter options
  const getUniqueCategories = () => {
    const cats = new Set(initialWebsites.map(w => w.category));
    return ['all', ...Array.from(cats)];
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-screen transition-all duration-700 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900'
          : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50'
      }`}
    >
      {/* Enhanced Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated Grid */}
        <div className={`absolute inset-0 ${
          isDarkMode
            ? 'bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] bg-[size:40px_40px]'
            : 'bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.08)_1px,transparent_0)] bg-[size:40px_40px]'
        }`} />

        {/* Floating Gradient Orbs */}
        <motion.div
          className={`parallax-slow absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl ${
            isDarkMode
              ? 'bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20'
              : 'bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30'
          }`}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <motion.div
          className={`parallax-fast absolute -bottom-40 -right-40 w-80 h-80 rounded-full blur-3xl ${
            isDarkMode
              ? 'bg-gradient-to-l from-indigo-600/20 via-cyan-600/20 to-blue-600/20'
              : 'bg-gradient-to-l from-indigo-400/30 via-cyan-400/30 to-blue-400/30'
          }`}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <motion.div
          className={`parallax-slow absolute top-1/3 right-1/4 w-64 h-64 rounded-full blur-3xl ${
            isDarkMode
              ? 'bg-gradient-to-br from-emerald-600/15 via-teal-600/15 to-cyan-600/15'
              : 'bg-gradient-to-br from-emerald-400/25 via-teal-400/25 to-cyan-400/25'
          }`}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Navigation */}
      <Navigation
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className={`text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Welcome to Your{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Digital Workspace
                </span>
              </h1>
              <p className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Access all your essential business systems from one unified, intelligent dashboard designed for modern teams.
              </p>
            </motion.div>

          </motion.section>

          {/* Systems Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            {/* Section Header with Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
              <div>
                <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Your Systems
                </h2>
                <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Access and manage all your business applications
                </p>
              </div>

              {/* Filters and Controls */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  {getUniqueCategories().map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 capitalize ${
                        activeCategory === category
                          ? isDarkMode
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                            : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                          : isDarkMode
                            ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 border border-gray-700'
                            : 'bg-white/50 text-gray-600 hover:bg-white border border-gray-200'
                      }`}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>

                {/* View Mode Toggle */}
                <div className={`flex items-center rounded-xl p-1 ${
                  isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/50 border border-gray-200'
                }`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'grid'
                        ? isDarkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-600 text-white'
                        : isDarkMode
                          ? 'text-gray-400 hover:text-gray-200'
                          : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'list'
                        ? isDarkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-600 text-white'
                        : isDarkMode
                          ? 'text-gray-400 hover:text-gray-200'
                          : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFilters(!showFilters)}
                    data-filters-button
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 border border-gray-700'
                        : 'bg-white/50 text-gray-600 hover:bg-white border border-gray-200'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    Sort & Filter
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </motion.button>

                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        data-filters-panel
                        className={`absolute right-0 top-full mt-2 w-64 rounded-2xl shadow-xl border backdrop-blur-xl z-50 ${
                          isDarkMode
                            ? 'bg-gray-800/90 border-gray-700'
                            : 'bg-white/90 border-gray-200'
                        }`}
                      >
                        <div className="p-4">
                          <div className="mb-4">
                            <label className={`block text-sm font-medium mb-2 ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Sort by
                            </label>
                            <select
                              value={sortBy}
                              onChange={(e) => setSortBy(e.target.value as SortOption)}
                              className={`w-full p-2 rounded-lg border text-sm ${
                                isDarkMode
                                  ? 'bg-gray-700 border-gray-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            >
                              {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className={`block text-sm font-medium mb-2 ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Filter by tags
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {allTags.map((tag) => (
                                <motion.button
                                  key={tag}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => toggleTag(tag)}
                                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                                    selectedTags.includes(tag)
                                      ? 'bg-blue-600 text-white'
                                      : isDarkMode
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  {tag}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Systems Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Favorites Section */}
              {favoriteWebsites.length > 0 && (
                <>
                  <div className="col-span-full">
                    <h3 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      Your Favorites
                    </h3>
                  </div>
                  {favoriteWebsites.map((website, index) => (
                    <SystemCard
                      key={website.id}
                      website={website}
                      isDarkMode={isDarkMode}
                      isFavorite={true}
                      onToggleFavorite={toggleFavorite}
                      index={index}
                    />
                  ))}
                </>
              )}

              {/* Recommended Section */}
              {recommendedWebsites.length > 0 && (
                <>
                  <div className="col-span-full">
                    <h3 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      <Sparkles className="w-5 h-5 text-blue-500" />
                      Recommended for You
                    </h3>
                  </div>
                  {recommendedWebsites.map((website, index) => (
                    <SystemCard
                      key={website.id}
                      website={website}
                      isDarkMode={isDarkMode}
                      isFavorite={false}
                      onToggleFavorite={toggleFavorite}
                      index={index + favoriteWebsites.length}
                    />
                  ))}
                </>
              )}

              {/* Other Systems */}
              {otherWebsites.length > 0 && (
                <>
                  <div className="col-span-full">
                    <h3 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      <Layers className="w-5 h-5 text-gray-500" />
                      All Systems
                    </h3>
                  </div>
                  {otherWebsites.map((website, index) => (
                    <SystemCard
                      key={website.id}
                      website={website}
                      isDarkMode={isDarkMode}
                      isFavorite={false}
                      onToggleFavorite={toggleFavorite}
                      index={index + favoriteWebsites.length + recommendedWebsites.length}
                    />
                  ))}
                </>
              )}
            </div>
          </motion.section>

          {/* Activity Feed Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2">
              <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                System Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* System Health */}
                <div className={`p-6 rounded-2xl backdrop-blur-xl border ${
                  isDarkMode
                    ? 'bg-gray-800/50 border-gray-700/50'
                    : 'bg-white/50 border-gray-200/50'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      System Health
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                        All Systems Operational
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {initialWebsites.filter(w => w.status === 'active').map((website) => (
                      <div key={website.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                            {website.icon}
                          </div>
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {website.name}
                          </span>
                        </div>
                        <span className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          {website.uptime}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Usage Statistics */}
                <div className={`p-6 rounded-2xl backdrop-blur-xl border ${
                  isDarkMode
                    ? 'bg-gray-800/50 border-gray-700/50'
                    : 'bg-white/50 border-gray-200/50'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Usage This Week
                  </h3>
                  <div className="space-y-4">
                    {initialWebsites.filter(w => w.status === 'active').map((website) => (
                      <div key={website.id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {website.name}
                          </span>
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {website.usage}%
                          </span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${website.usage}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <ActivityFeed activities={recentActivities} isDarkMode={isDarkMode} />
            </div>
          </motion.section>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {showNotification && (
          <Notification message={notificationMessage} type={notificationType} />
        )}
      </AnimatePresence>
    </div>
  );
}
