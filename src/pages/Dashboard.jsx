import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, addDays, isWithinInterval, startOfToday } from 'date-fns';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiEdit3, FiCalendar, FiTrendingUp, FiPlus, FiArrowRight } = FiIcons;

function Dashboard() {
  const { state } = useData();
  const { personas, blogs } = state;

  const today = startOfToday();
  const nextWeek = addDays(today, 7);
  const nextMonth = addDays(today, 30);

  const upcomingBlogs7Days = blogs.filter(blog => {
    if (!blog.publishDate) return false;
    const publishDate = new Date(blog.publishDate);
    return isWithinInterval(publishDate, { start: today, end: nextWeek });
  });

  const upcomingBlogs30Days = blogs.filter(blog => {
    if (!blog.publishDate) return false;
    const publishDate = new Date(blog.publishDate);
    return isWithinInterval(publishDate, { start: today, end: nextMonth });
  });

  const stats = [
    {
      name: 'Client Types Created',
      value: personas.length,
      icon: FiUsers,
      color: 'text-blue-600 bg-blue-50',
      link: '/personas'
    },
    {
      name: 'Blog Topics Added',
      value: blogs.length,
      icon: FiEdit3,
      color: 'text-green-600 bg-green-50',
      link: '/blog-planner'
    },
    {
      name: 'Upcoming (7 Days)',
      value: upcomingBlogs7Days.length,
      icon: FiCalendar,
      color: 'text-purple-600 bg-purple-50',
      link: '/calendar'
    },
    {
      name: 'Published Blogs',
      value: blogs.filter(b => b.status === 'Published').length,
      icon: FiTrendingUp,
      color: 'text-orange-600 bg-orange-50',
      link: '/analytics'
    }
  ];

  const quickActions = [
    {
      name: 'Add New Client Type',
      description: 'Define a new client persona for targeted content',
      icon: FiUsers,
      link: '/personas',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Plan New Blog',
      description: 'Create a new blog post idea and schedule',
      icon: FiEdit3,
      link: '/blog-planner',
      color: 'bg-green-600 hover:bg-green-700'
    }
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Your SEO Content Planner
        </h1>
        <p className="text-gray-600">
          Plan, organize, and track your therapy practice's content strategy
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={stat.link} className="block">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <SafeIcon icon={stat.icon} className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  to={action.link}
                  className="block group"
                >
                  <div className="flex items-center p-4 rounded-lg border border-gray-200 group-hover:border-gray-300 transition-colors">
                    <div className={`p-2 rounded-lg ${action.color} mr-4`}>
                      <SafeIcon icon={action.icon} className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 group-hover:text-gray-700">
                        {action.name}
                      </h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <SafeIcon icon={FiArrowRight} className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Upcoming Blogs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Blogs</h2>
              <Link to="/calendar" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View Calendar
              </Link>
            </div>
            
            <div className="space-y-4">
              {upcomingBlogs7Days.length > 0 ? (
                upcomingBlogs7Days.slice(0, 5).map((blog) => (
                  <div key={blog.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 truncate">{blog.title}</h3>
                      <p className="text-sm text-gray-600">
                        {blog.publishDate ? format(new Date(blog.publishDate), 'MMM dd, yyyy') : 'No date set'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${blog.status === 'Published' ? 'bg-green-100 text-green-800' :
                        blog.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        blog.status === 'Drafted' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                      {blog.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <SafeIcon icon={FiCalendar} className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No upcoming blogs scheduled</p>
                  <Link 
                    to="/blog-planner"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block"
                  >
                    Plan your first blog
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;