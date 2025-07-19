import React, { createContext, useContext, useReducer, useEffect } from 'react';

const DataContext = createContext();

const initialState = {
  personas: [],
  blogs: [],
  gptExports: []
};

function dataReducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    
    case 'ADD_PERSONA':
      const newPersonas = [...state.personas, { ...action.payload, id: Date.now().toString() }];
      return { ...state, personas: newPersonas };
    
    case 'UPDATE_PERSONA':
      return {
        ...state,
        personas: state.personas.map(p => 
          p.id === action.payload.id ? action.payload : p
        )
      };
    
    case 'DELETE_PERSONA':
      return {
        ...state,
        personas: state.personas.filter(p => p.id !== action.payload)
      };
    
    case 'ADD_BLOG':
      const newBlogs = [...state.blogs, { ...action.payload, id: Date.now().toString() }];
      return { ...state, blogs: newBlogs };
    
    case 'UPDATE_BLOG':
      return {
        ...state,
        blogs: state.blogs.map(b => 
          b.id === action.payload.id ? action.payload : b
        )
      };
    
    case 'DELETE_BLOG':
      return {
        ...state,
        blogs: state.blogs.filter(b => b.id !== action.payload)
      };
    
    case 'ADD_GPT_EXPORT':
      return {
        ...state,
        gptExports: [...state.gptExports, { ...action.payload, id: Date.now().toString() }]
      };
    
    default:
      return state;
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  useEffect(() => {
    const savedData = localStorage.getItem('therapist-seo-data');
    if (savedData) {
      dispatch({ type: 'LOAD_DATA', payload: JSON.parse(savedData) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('therapist-seo-data', JSON.stringify(state));
  }, [state]);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}