
const BASE = 'http://localhost/todo/api.php';

 async function request(method, params = {}, body = null) {
  const url = new URL(BASE);
  Object.entries(params).forEach(([k, v]) => v !== '' && url.searchParams.set(k, v));

  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) options.body = JSON.stringify(body);

  const res  = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Server error');
  return data;
}


export const getTasks = (filters = {}, limit = 6, offset = 0) =>
  request('GET', { ...filters, limit, offset });

export const getTask = (id) =>
  request('GET', { id });

export const createTask = (payload) =>
  request('POST', {}, payload);

export const updateTask = (id, payload) =>
  request('PUT', { id }, payload);

export const toggleTask = (id) =>
  request('PUT', { id, action: 'toggle' });


export const deleteTask = (id) =>
  request('DELETE', { id });