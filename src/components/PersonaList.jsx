import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit3, FiTrash2, FiSend, FiUser, FiMapPin, FiTarget, FiSearch } = FiIcons;

function PersonaList({ personas, blogs, onEdit, onSendToGPT }) {
  const { dispatch } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAge, setFilterAge] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  const handleDelete = (personaId) => {
    if (window.confirm('Are you sure you want to delete this client type? This action cannot be undone.')) {
      dispatch({ type: 'DELETE_PERSONA', payload: personaId });
    }
  };

  const getLinkedBlogsCount = (personaId) => {
    return blogs.filter(blog => blog.personaId === personaId).length;
  };

  const filteredPersonas = personas.filter(persona => {
    const matchesSearch = persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         persona.primaryConcerns?.some(concern => 
                           concern.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesAge = !filterAge || persona.ageRange === filterAge;
    const matchesLocation = !filterLocation || 
                           persona.location?.toLowerCase().includes(filterLocation.toLowerCase());

    return matchesSearch && matchesAge && matchesLocation;
  });

  const uniqueAgeRanges = [...new Set(personas.map(p => p.ageRange).filter(Boolean))];
  const uniqueLocations = [...new Set(personas.map(p => p.location).filter(Boolean))];

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search client types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterAge}
            onChange={(e) => setFilterAge(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Age Ranges</option>
            {uniqueAgeRanges.map(age => (
              <option key={age} value={age}>{age}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Filter by location..."
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Personas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPersonas.map((persona, index) => (
          <motion.div
            key={persona.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-primary-50 rounded-lg mr-3">
                  <SafeIcon icon={FiUser} className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{persona.name}</h3>
                  <p className="text-sm text-gray-600">{persona.ageRange}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSendToGPT(persona)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Send to GPT"
                >
                  <SafeIcon icon={FiSend} className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(persona)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(persona.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Location */}
            {persona.location && (
              <div className="flex items-center mb-3">
                <SafeIcon icon={FiMapPin} className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">{persona.location}</span>
              </div>
            )}

            {/* Primary Concerns */}
            {persona.primaryConcerns && persona.primaryConcerns.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <SafeIcon icon={FiTarget} className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Primary Concerns</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {persona.primaryConcerns.slice(0, 4).map((concern, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {concern}
                    </span>
                  ))}
                  {persona.primaryConcerns.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      +{persona.primaryConcerns.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Keywords Preview */}
            {persona.keywords && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  <span className="font-medium">Keywords:</span> {persona.keywords}
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">
                {getLinkedBlogsCount(persona.id)} linked blog posts
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSendToGPT(persona)}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Send to GPT
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPersonas.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiUser} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Client Types Found</h3>
          <p className="text-gray-600">
            {searchTerm || filterAge || filterLocation
              ? 'Try adjusting your filters to see more results.'
              : 'Start by creating your first client persona.'
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default PersonaList;