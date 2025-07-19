import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiSave } = FiIcons;

const ageRanges = [
  'Teens (13-17)',
  'Young Adults (18-25)',
  'Adults (26-35)',
  'Mid-Adults (36-45)',
  'Mature Adults (46-55)',
  'Seniors (56+)',
  'All Ages'
];

const commonConcerns = [
  'Anxiety',
  'Depression',
  'Relationship Issues',
  'Work Stress',
  'Family Problems',
  'Trauma',
  'Self-Esteem',
  'Life Transitions',
  'Grief & Loss',
  'Addiction',
  'Anger Management',
  'Parenting Challenges'
];

function PersonaForm({ persona, onClose }) {
  const { dispatch } = useData();
  const [formData, setFormData] = useState({
    name: '',
    ageRange: '',
    primaryConcerns: [],
    keywords: '',
    therapyGoals: '',
    location: '',
    customConcerns: ''
  });

  useEffect(() => {
    if (persona) {
      setFormData({
        name: persona.name || '',
        ageRange: persona.ageRange || '',
        primaryConcerns: persona.primaryConcerns || [],
        keywords: persona.keywords || '',
        therapyGoals: persona.therapyGoals || '',
        location: persona.location || '',
        customConcerns: ''
      });
    }
  }, [persona]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Combine selected concerns with custom ones
    let allConcerns = [...formData.primaryConcerns];
    if (formData.customConcerns.trim()) {
      const customArray = formData.customConcerns.split(',').map(c => c.trim()).filter(c => c);
      allConcerns = [...allConcerns, ...customArray];
    }

    const personaData = {
      ...formData,
      primaryConcerns: allConcerns,
      customConcerns: undefined // Remove this from the saved data
    };

    if (persona) {
      dispatch({
        type: 'UPDATE_PERSONA',
        payload: { ...persona, ...personaData }
      });
    } else {
      dispatch({
        type: 'ADD_PERSONA',
        payload: personaData
      });
    }

    onClose();
  };

  const handleConcernToggle = (concern) => {
    setFormData(prev => ({
      ...prev,
      primaryConcerns: prev.primaryConcerns.includes(concern)
        ? prev.primaryConcerns.filter(c => c !== concern)
        : [...prev.primaryConcerns, concern]
    }));
  };

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
            {persona ? 'Edit Client Type' : 'Add New Client Type'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Persona Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Type Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Anxious Young Professional, Overwhelmed Parent"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Age Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age Range
            </label>
            <select
              value={formData.ageRange}
              onChange={(e) => setFormData(prev => ({ ...prev, ageRange: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select age range</option>
              {ageRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          {/* Primary Concerns */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Concerns
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              {commonConcerns.map(concern => (
                <label key={concern} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.primaryConcerns.includes(concern)}
                    onChange={() => handleConcernToggle(concern)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{concern}</span>
                </label>
              ))}
            </div>
            <input
              type="text"
              value={formData.customConcerns}
              onChange={(e) => setFormData(prev => ({ ...prev, customConcerns: e.target.value }))}
              placeholder="Add custom concerns (comma-separated)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Keywords/Phrases
            </label>
            <textarea
              value={formData.keywords}
              onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
              placeholder="What might they search for on Google? e.g., 'anxiety therapist near me', 'how to deal with work stress'"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Therapy Goals */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What They Want from Therapy
            </label>
            <textarea
              value={formData.therapyGoals}
              onChange={(e) => setFormData(prev => ({ ...prev, therapyGoals: e.target.value }))}
              placeholder="What are their goals and desired outcomes from therapy?"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Area/Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., San Francisco Bay Area, Online/Telehealth, Nationwide"
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
              {persona ? 'Update' : 'Save'} Client Type
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default PersonaForm;