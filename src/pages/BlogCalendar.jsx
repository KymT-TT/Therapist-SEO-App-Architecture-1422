import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiChevronLeft, FiChevronRight, FiEdit3, FiEye } = FiIcons;

const statusColors = {
  'Idea': 'bg-gray-100 text-gray-800 border-gray-300',
  'Drafted': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'Scheduled': 'bg-blue-100 text-blue-800 border-blue-300',
  'Published': 'bg-green-100 text-green-800 border-green-300'
};

function BlogCalendar() {
  const { state } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBlog, setSelectedBlog] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getBlogsForDate = (date) => {
    return state.blogs.filter(blog => {
      if (!blog.publishDate) return false;
      return isSameDay(new Date(blog.publishDate), date);
    });
  };

  const getPersonaName = (personaId) => {
    const persona = state.personas.find(p => p.id === personaId);
    return persona ? persona.name : 'No Client Type';
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const today = () => setCurrentDate(new Date());

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Calendar</h1>
          <p className="text-gray-600">
            View and manage your blog publishing schedule
          </p>
        </div>
        <button
          onClick={today}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Today
        </button>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiChevronLeft} className="w-5 h-5 text-gray-600" />
          </button>
          
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiChevronRight} className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(day => {
            const blogsForDay = getBlogsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <motion.div
                key={day.toISOString()}
                className={`
                  min-h-32 p-2 border border-gray-100 transition-colors
                  ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                  ${isToday ? 'ring-2 ring-primary-500' : ''}
                `}
                whileHover={{ backgroundColor: isCurrentMonth ? '#f9fafb' : '#f3f4f6' }}
              >
                <div className={`
                  text-sm font-medium mb-2
                  ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                  ${isToday ? 'text-primary-600' : ''}
                `}>
                  {format(day, 'd')}
                </div>

                <div className="space-y-1">
                  {blogsForDay.slice(0, 3).map(blog => (
                    <div
                      key={blog.id}
                      onClick={() => setSelectedBlog(blog)}
                      className={`
                        px-2 py-1 rounded text-xs font-medium cursor-pointer border
                        ${statusColors[blog.status]}
                        hover:opacity-80 transition-opacity
                      `}
                      title={blog.title}
                    >
                      <div className="truncate">{blog.title}</div>
                    </div>
                  ))}
                  {blogsForDay.length > 3 && (
                    <div className="text-xs text-gray-500 px-2">
                      +{blogsForDay.length - 3} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Legend</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(statusColors).map(([status, classes]) => (
            <div key={status} className="flex items-center">
              <div className={`w-4 h-4 rounded border mr-2 ${classes}`}></div>
              <span className="text-sm text-gray-700">{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && setSelectedBlog(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Blog Details</h2>
              <button
                onClick={() => setSelectedBlog(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiEdit3} className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedBlog.title}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${statusColors[selectedBlog.status]}`}>
                    {selectedBlog.status}
                  </span>
                </div>

                {selectedBlog.personaId && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Target Client Type:</span>
                    <p className="text-gray-900">{getPersonaName(selectedBlog.personaId)}</p>
                  </div>
                )}

                {selectedBlog.targetKeyword && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Target Keyword:</span>
                    <p className="text-gray-900">{selectedBlog.targetKeyword}</p>
                  </div>
                )}

                {selectedBlog.publishDate && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Publish Date:</span>
                    <p className="text-gray-900">{format(new Date(selectedBlog.publishDate), 'MMMM dd, yyyy')}</p>
                  </div>
                )}

                {selectedBlog.notes && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Notes:</span>
                    <p className="text-gray-900 mt-1">{selectedBlog.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default BlogCalendar;