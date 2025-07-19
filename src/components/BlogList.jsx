import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit3, FiTrash2, FiSend, FiCalendar, FiUser, FiSearch, FiFilter } = FiIcons;

const statusColors = {
  'Idea': 'bg-gray-100 text-gray-800',
  'Drafted': 'bg-yellow-100 text-yellow-800',
  'Scheduled': 'bg-blue-100 text-blue-800',
  'Published': 'bg-green-100 text-green-800'
};

function BlogList({ blogs, personas, onEdit, onSendToGPT }) {
  const { dispatch } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPersona, setFilterPersona] = useState('');
  const [sortBy, setSortBy] = useState('publishDate');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleDelete = (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      dispatch({ type: 'DELETE_BLOG', payload: blogId });
    }
  };

  const getPersonaName = (personaId) => {
    const persona = personas.find(p => p.id === personaId);
    return persona ? persona.name : 'No Client Type';
  };

  const filteredAndSortedBlogs = blogs
    .filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.targetKeyword?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !filterStatus || blog.status === filterStatus;
      const matchesPersona = !filterPersona || blog.personaId === filterPersona;

      return matchesSearch && matchesStatus && matchesPersona;
    })
    .sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'title':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        case 'publishDate':
          aVal = a.publishDate ? new Date(a.publishDate) : new Date(0);
          bVal = b.publishDate ? new Date(b.publishDate) : new Date(0);
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div>
      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="Idea">Ideas</option>
            <option value="Drafted">Drafted</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Published">Published</option>
          </select>
          <select
            value={filterPersona}
            onChange={(e) => setFilterPersona(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Client Types</option>
            {personas.map(persona => (
              <option key={persona.id} value={persona.id}>{persona.name}</option>
            ))}
          </select>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="publishDate-desc">Newest First</option>
            <option value="publishDate-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="status-asc">Status A-Z</option>
          </select>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="space-y-4">
        {filteredAndSortedBlogs.map((blog, index) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {blog.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[blog.status]}`}>
                    {blog.status}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                  {blog.personaId && (
                    <div className="flex items-center">
                      <SafeIcon icon={FiUser} className="w-4 h-4 mr-1" />
                      <span>{getPersonaName(blog.personaId)}</span>
                    </div>
                  )}
                  {blog.publishDate && (
                    <div className="flex items-center">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                      <span>{format(new Date(blog.publishDate), 'MMM dd, yyyy')}</span>
                    </div>
                  )}
                  {blog.targetKeyword && (
                    <div className="flex items-center">
                      <span className="font-medium">Keyword:</span>
                      <span className="ml-1">{blog.targetKeyword}</span>
                    </div>
                  )}
                </div>

                {blog.notes && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {blog.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onSendToGPT(blog)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Send to GPT"
                >
                  <SafeIcon icon={FiSend} className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(blog)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAndSortedBlogs.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiEdit3} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Blog Posts Found</h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus || filterPersona
              ? 'Try adjusting your filters to see more results.'
              : 'Start by creating your first blog post idea.'
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default BlogList;