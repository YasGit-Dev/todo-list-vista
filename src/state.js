
const state = {
  tasks:       [],
  taskDates:   [],     
  stats:       { total: 0, completed: 0, pending: 0 },
  filters:     { status: '', priority: '', category: '', search: '', date: '' },
  pagination:  { limit: 6, offset: 0, hasMore: false },
  editing:     null,  
  calendar:    null,
};

export const getState = (key) => state[key];

export const setState = (key, value) => {
  if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
    state[key] = { ...state[key], ...value };
  } else {
    state[key] = value;
  }
};

export const resetFilters = () => {
  state.filters    = { status: '', priority: '', category: '', search: '', date: '' };
  state.pagination = { ...state.pagination, offset: 0, hasMore: false };
};

export const resetPagination = () => {
  state.pagination = { ...state.pagination, offset: 0 };
};