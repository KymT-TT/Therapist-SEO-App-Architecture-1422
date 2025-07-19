import React from 'react';
import { motion } from 'framer-motion';
import { format, subMonths, eachMonthOfInterval } from 'date-fns';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiUsers, FiEdit3, FiCalendar, FiTarget, FiBarChart3 } = FiIcons;

function Analytics() {
  const { state } = useData();
  const { personas, blogs } = state;

  // Calculate persona coverage
  const personasCoverage = personas.map(persona => ({
    ...persona,
    blogCount: blogs.filter(blog => blog.personaId === persona.id).length
  }));

  // Calculate status distribution
  const statusCounts = {
    idea: blogs.filter(b => b.status === 'Idea').length,
    drafted: blogs.filter(b => b.status === 'Drafted').length,
    scheduled: blogs.filter(b => b.status === 'Scheduled').length,
    published: blogs.filter(b => b.status === 'Published').length,
  };

  // Calculate monthly blog consistency (last 6 months)
  const sixMonthsAgo = subMonths(new Date(), 5);
  const months = eachMonthOfInterval({ start: sixMonthsAgo, end: new Date() });
  
  const monthlyData = months.map(month => ({
    month: format(month, 'MMM yyyy'),
    count: blogs.filter(blog => {
      if (!blog.publishDate) return false;
      const blogDate = new Date(blog.publishDate);
      return blogDate.getFullYear() === month.getFullYear() && 
             blogDate.getMonth() === month.getMonth();
    }).length
  }));

  // Top performing concerns (based on blog count)
  const concernCounts = {};
  personas.forEach(persona => {
    if (persona.primaryConcerns) {
      persona.primaryConcerns.forEach(concern => {
        concernCounts[concern] = (concernCounts[concern] || 0) + 
          blogs.filter(blog => blog.personaId === persona.id).length;
      });
    }
  });

  const topConcerns = Object.entries(concernCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Analytics</h1>
        <p className="text-gray-600">
          Track your content strategy performance and identify opportunities
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg mr-4">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{personas.length}</p>
              <p className="text-sm text-gray-600">Client Types</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg mr-4">
              <SafeIcon icon={FiEdit3} className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
              <p className="text-sm text-gray-600">Total Blog Posts</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg mr-4">
              <SafeIcon icon={FiTarget} className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {personasCoverage.filter(p => p.blogCount > 0).length}
              </p>
              <p className="text-sm text-gray-600">Types with Content</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-50 rounded-lg mr-4">
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.published}</p>
              <p className="text-sm text-gray-600">Published Posts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Blog Status Distribution</h2>
          <div className="space-y-4">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage = blogs.length > 0 ? Math.round((count / blogs.length) * 100) : 0;
              const colors = {
                idea: 'bg-gray-200',
                drafted: 'bg-yellow-200',
                scheduled: 'bg-blue-200',
                published: 'bg-green-200'
              };
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <span className="text-sm font-medium text-gray-700 capitalize w-20">
                      {status}
                    </span>
                    <div className="flex-1 mx-4 bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colors[status]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                    <span className="text-xs text-gray-600 ml-1">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Persona Coverage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Client Type Coverage</h2>
          <div className="space-y-4">
            {personasCoverage.slice(0, 6).map((persona, index) => (
              <div key={persona.id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {persona.name}
                  </p>
                  <p className="text-xs text-gray-600">{persona.ageRange}</p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-gray-900 mr-2">
                    {persona.blogCount}
                  </span>
                  <div className="w-12 h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 bg-primary-500 rounded-full"
                      style={{
                        width: `${blogs.length > 0 ? Math.min((persona.blogCount / Math.max(...personasCoverage.map(p => p.blogCount))) * 100, 100) : 0}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {personasCoverage.length === 0 && (
              <p className="text-gray-500 text-center py-4">No client types created yet</p>
            )}
          </div>
        </motion.div>

        {/* Monthly Consistency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Blog Consistency</h2>
          <div className="space-y-4">
            {monthlyData.map((data, index) => {
              const maxCount = Math.max(...monthlyData.map(d => d.count));
              const percentage = maxCount > 0 ? (data.count / maxCount) * 100 : 0;
              
              return (
                <div key={data.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 w-20">
                    {data.month}
                  </span>
                  <div className="flex-1 mx-4 bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 bg-primary-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                    {data.count}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Concerns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Content Topics</h2>
          <div className="space-y-4">
            {topConcerns.length > 0 ? (
              topConcerns.map(([concern, count]) => {
                const maxCount = Math.max(...topConcerns.map(([,c]) => c));
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                
                return (
                  <div key={concern} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 flex-1 min-w-0 truncate">
                      {concern}
                    </span>
                    <div className="flex items-center ml-4">
                      <div className="w-16 h-2 bg-gray-100 rounded-full mr-2">
                        <div
                          className="h-2 bg-green-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-6 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">
                No content topics available yet
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Content Strategy Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Coverage Analysis</h3>
            <p className="text-sm text-blue-800">
              {personasCoverage.filter(p => p.blogCount === 0).length > 0
                ? `${personasCoverage.filter(p => p.blogCount === 0).length} client types need content. Consider creating targeted posts for better coverage.`
                : 'Great! All your client types have associated content.'
              }
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">Publishing Progress</h3>
            <p className="text-sm text-green-800">
              {statusCounts.published === 0
                ? 'Start publishing your drafted content to improve your SEO presence.'
                : `${statusCounts.published} posts published! ${statusCounts.drafted + statusCounts.scheduled} more in your pipeline.`
              }
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Analytics;