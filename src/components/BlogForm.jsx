import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiSave } = FiIcons;

const statusOptions = [
  { value: 'Idea', label: 'Idea', color: 'bg-gray-100 text-gray-800' },
  { value: 'Drafted', label: 'Drafted', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Scheduled', label: 'Scheduled', color: 'bg-blue-100 text-blue-800' },
  { value: 'Published', label: 'Published', color: 'bg-green-100 text-green-800' }
];

function BlogForm({ blog, personas, onClose }) {
  const { dispatch } = useData();
  const [formData, setFormData] = useState({
    title: '',
    personaId: '',
    targetKeyword: '',
    status: 'Idea',
    publishDate: '',
    notes: ''
  });

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || '',
        personaId: blog.personaId || '',
        targetKeyword: blog.targetKeyword || '',
        status: blog.status || 'Idea',
        publishDate: blog.publishDate || '',
        notes: blog.notes || ''
      });
    }
  }, [blog]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (blog) {
      dispatch({
        type: 'UPDATE_BLOG',
        payload: { ...blog, ...formData }
      });
    } else {
      dispatch({
        type: 'ADD_BLOG',
        payload: formData
      });
    }

    onClose();
  };

  const selectedPersona = personas.find(p => p.id === formData.personaId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {blog ? 'Edit Blog Post' : 'Add New Blog Post'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Blog Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., 5 Ways to Manage Anxiety at Work"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Assigned Persona */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Client Type
            </label>
            <select
              value={formData.personaId}
              onChange={(e) => setFormData(prev => ({ ...prev, personaId: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select a client type</option>
              {personas.map(persona => (
                <option key={persona.id} value={persona.id}>{persona.name}</option>
              ))}
            </select>
            {selectedPersona && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Age:</span> {selectedPersona.ageRange}
                </p>
                {selectedPersona.primaryConcerns && selectedPersona.primaryConcerns.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Concerns:</span> {selectedPersona.primaryConcerns.slice(0, 3).join(', ')}
                    {selectedPersona.primaryConcerns.length > 3 && '...'}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Target Keyword */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target SEO Keyword
            </label>
            <input
              type="text"
              value={formData.targetKeyword}
              onChange={(e) => setFormData(prev => ({ ...prev, targetKeyword: e.target.value }))}
              placeholder="e.g., anxiety management techniques, therapy for work stress"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {statusOptions.map(option => (
                <label
                  key={option.value}
                  className={`
                    flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors
                    ${formData.status === option.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={formData.status === option.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="sr-only"
                  />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${option.color}`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Publish Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intended Publish Date
            </label>
            <input
              type="date"
              value={formData.publishDate}
              onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any additional notes, ideas, or reminders for this blog post..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
              {blog ? 'Update' : 'Save'} Blog Post
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default BlogForm;