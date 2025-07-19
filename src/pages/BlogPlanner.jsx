import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import BlogForm from '../components/BlogForm';
import BlogList from '../components/BlogList';
import GPTModal from '../components/GPTModal';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiEdit3, FiCalendar, FiCheckCircle } = FiIcons;

function BlogPlanner() {
  const { state } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [showGPTModal, setShowGPTModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBlog(null);
  };

  const handleSendToGPT = (blog) => {
    setSelectedBlog(blog);
    setShowGPTModal(true);
  };

  const statusCounts = {
    idea: state.blogs.filter(b => b.status === 'Idea').length,
    drafted: state.blogs.filter(b => b.status === 'Drafted').length,
    scheduled: state.blogs.filter(b => b.status === 'Scheduled').length,
    published: state.blogs.filter(b => b.status === 'Published').length,
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Planner</h1>
          <p className="text-gray-600">
            Plan, organize, and track your therapy practice's blog content
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
          Add Blog Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-gray-50 rounded-lg mr-4">
              <SafeIcon icon={FiEdit3} className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.idea}</p>
              <p className="text-sm text-gray-600">Ideas</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg mr-4">
              <SafeIcon icon={FiEdit3} className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.drafted}</p>
              <p className="text-sm text-gray-600">Drafted</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg mr-4">
              <SafeIcon icon={FiCalendar} className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.scheduled}</p>
              <p className="text-sm text-gray-600">Scheduled</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg mr-4">
              <SafeIcon icon={FiCheckCircle} className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.published}</p>
              <p className="text-sm text-gray-600">Published</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {state.blogs.length === 0 && !showForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiEdit3} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Blog Posts Yet</h3>
          <p className="text-gray-600 mb-6">
            Start planning your content strategy by creating your first blog post idea
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mx-auto"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
            Create Your First Blog Post
          </button>
        </motion.div>
      ) : (
        <BlogList
          blogs={state.blogs}
          personas={state.personas}
          onEdit={handleEdit}
          onSendToGPT={handleSendToGPT}
        />
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <BlogForm
            blog={editingBlog}
            personas={state.personas}
            onClose={handleCloseForm}
          />
        )}
      </AnimatePresence>

      {/* GPT Modal */}
      <AnimatePresence>
        {showGPTModal && selectedBlog && (
          <GPTModal
            type="blog"
            data={selectedBlog}
            personas={state.personas}
            onClose={() => {
              setShowGPTModal(false);
              setSelectedBlog(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default BlogPlanner;