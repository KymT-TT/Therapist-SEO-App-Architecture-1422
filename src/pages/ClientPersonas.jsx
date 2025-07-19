import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import PersonaForm from '../components/PersonaForm';
import PersonaList from '../components/PersonaList';
import GPTModal from '../components/GPTModal';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiUsers } = FiIcons;

function ClientPersonas() {
  const { state } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingPersona, setEditingPersona] = useState(null);
  const [showGPTModal, setShowGPTModal] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(null);

  const handleEdit = (persona) => {
    setEditingPersona(persona);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPersona(null);
  };

  const handleSendToGPT = (persona) => {
    setSelectedPersona(persona);
    setShowGPTModal(true);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Types</h1>
          <p className="text-gray-600">
            Define your ideal client personas to create targeted, effective content
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
          Add Client Type
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg mr-4">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{state.personas.length}</p>
              <p className="text-sm text-gray-600">Total Client Types</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg mr-4">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {state.blogs.filter(b => b.personaId).length}
              </p>
              <p className="text-sm text-gray-600">Linked Blog Posts</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg mr-4">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(state.blogs.filter(b => b.personaId).map(b => b.personaId)).size}
              </p>
              <p className="text-sm text-gray-600">Types with Content</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {state.personas.length === 0 && !showForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiUsers} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Client Types Yet</h3>
          <p className="text-gray-600 mb-6">
            Start by creating your first client persona to target your content effectively
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mx-auto"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
            Create Your First Client Type
          </button>
        </motion.div>
      ) : (
        <PersonaList
          personas={state.personas}
          blogs={state.blogs}
          onEdit={handleEdit}
          onSendToGPT={handleSendToGPT}
        />
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <PersonaForm
            persona={editingPersona}
            onClose={handleCloseForm}
          />
        )}
      </AnimatePresence>

      {/* GPT Modal */}
      <AnimatePresence>
        {showGPTModal && selectedPersona && (
          <GPTModal
            type="persona"
            data={selectedPersona}
            onClose={() => {
              setShowGPTModal(false);
              setSelectedPersona(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default ClientPersonas;