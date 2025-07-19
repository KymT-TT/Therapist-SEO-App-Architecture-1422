import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiCopy, FiExternalLink, FiCheck } = FiIcons;

// Updated GPT URL
const GPT_URL = 'https://chatgpt.com/g/g-687a5706eea081919fd1426801efbe55-therapist-seo-blog-writer';
const GPT_PASSWORD = 'Clarity2025';

function GPTModal({ type, data, personas = [], onClose }) {
  const { dispatch } = useData();
  const [copied, setCopied] = useState(false);

  const generatePrompt = () => {
    if (type === 'persona') {
      return `Password: ${GPT_PASSWORD}

I need help creating SEO-optimized blog content for my therapy practice. Here's my target client persona:

**Client Type:** ${data.name}
**Age Range:** ${data.ageRange || 'Not specified'}
**Location:** ${data.location || 'Not specified'}

**Primary Concerns:**
${data.primaryConcerns && data.primaryConcerns.length > 0 
  ? data.primaryConcerns.map(concern => `• ${concern}`).join('\n')
  : 'Not specified'}

**Search Keywords/Phrases:**
${data.keywords || 'Not specified'}

**Therapy Goals:**
${data.therapyGoals || 'Not specified'}

Please help me create blog post ideas that would resonate with this client type and rank well for their search terms. Focus on topics that address their concerns and align with their therapy goals.`;
    } else if (type === 'blog') {
      const persona = personas.find(p => p.id === data.personaId);
      
      return `Password: ${GPT_PASSWORD}

I need help writing an SEO-optimized blog post for my therapy practice. Here are the details:

**Blog Title:** ${data.title}
**Target SEO Keyword:** ${data.targetKeyword || 'Not specified'}
**Current Status:** ${data.status}
${data.publishDate ? `**Intended Publish Date:** ${data.publishDate}` : ''}

${persona ? `**Target Client Type:** ${persona.name}
**Age Range:** ${persona.ageRange || 'Not specified'}
**Primary Concerns:** ${persona.primaryConcerns?.join(', ') || 'Not specified'}
**Client Keywords:** ${persona.keywords || 'Not specified'}
**Therapy Goals:** ${persona.therapyGoals || 'Not specified'}` : ''}

${data.notes ? `**Additional Notes:** ${data.notes}` : ''}

Please help me write a complete, SEO-optimized blog post that:
1. Addresses the target client type's concerns
2. Incorporates the target keyword naturally
3. Provides valuable, actionable advice
4. Maintains a professional yet approachable tone suitable for therapy clients
5. Includes a compelling introduction and call-to-action`;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatePrompt());
      setCopied(true);
      
      // Track the export
      dispatch({
        type: 'ADD_GPT_EXPORT',
        payload: {
          type,
          dataId: data.id,
          dataTitle: type === 'persona' ? data.name : data.title,
          timestamp: new Date().toISOString()
        }
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleOpenGPT = () => {
    handleCopy(); // Copy the prompt first
    window.open(GPT_URL, '_blank');
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
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Send to GPT</h2>
            <p className="text-sm text-gray-600 mt-1">
              {type === 'persona' 
                ? `Generate content ideas for "${data.name}"`
                : `Get help writing "${data.title}"`
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Copy the prompt below</li>
              <li>2. Open the GPT (link provided)</li>
              <li>3. Paste the prompt and send</li>
              <li>4. Follow the GPT's guidance for your content</li>
            </ol>
          </div>

          {/* Prompt Preview */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Generated Prompt:
            </label>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                {generatePrompt()}
              </pre>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCopy}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <SafeIcon 
                  icon={copied ? FiCheck : FiCopy} 
                  className="w-4 h-4 mr-2" 
                />
                {copied ? 'Copied!' : 'Copy Prompt'}
              </button>
              
              <button
                onClick={handleOpenGPT}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <SafeIcon icon={FiExternalLink} className="w-4 h-4 mr-2" />
                Copy & Open GPT
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>

          {/* GPT Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">GPT:</span> Therapist SEO Blog Writer<br/>
              <span className="font-medium">Password:</span> {GPT_PASSWORD}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default GPTModal;