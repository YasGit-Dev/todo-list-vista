import './style.css'
import flatpickr from 'flatpickr';
import './flatpickr-custom.css';

// const input = document.createElement('input');
// input.type = 'text';
// input.style.display = 'none';
// document.getElementById('calendar-wrapper').appendChild(input);

// flatpickr(input, {
//   inline: true
// });


import * as API              from './api.js';
import { getState, setState, resetPagination } from './state.js';
import { createTaskCard }    from './components/taskCard.js';
import { initModal, openModal } from './components/modal.js';
import { showToast }         from './components/toast.js';
import { renderStats }       from './modules/stats.js';
import { initFilters }       from './modules/filters.js';
import { initCalendar, refreshCalendar } from './modules/calendar.js';

// ── Init ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderDateHeader();
  initCalendar(loadTasks);
  initFilters(loadTasks);
  initModal(loadTasks);
  initAddTask();
  initLoadMore();
  loadTasks();
});

// ── تاریخ هدر ────────────────────────────
function renderDateHeader() {
  const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  const now = new Date();
  const wd  = document.getElementById('weekday');
  const fd  = document.getElementById('full-date');
  if (wd) wd.textContent = DAYS[now.getDay()];
  if (fd) fd.textContent = `${String(now.getDate()).padStart(2,'0')}, ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
}

// ── Load Tasks ────────────────────────────
async function loadTasks(reset = true) {
  const { filters, pagination } = {
    filters:    getState('filters'),
    pagination: getState('pagination'),
  };

  if (reset) resetPagination();
  const offset = reset ? 0 : getState('pagination').offset;

  try {
    const data = await API.getTasks(filters, pagination.limit, offset);

    setState('taskDates', data.task_dates ?? []);
    setState('stats',     data.stats);

    const tasks = data.tasks ?? [];
    if (reset) {
      setState('tasks', tasks);
    } else {
      setState('tasks', [...getState('tasks'), ...tasks]);
    }

    setState('pagination', { hasMore: tasks.length === pagination.limit });

    renderTasks();
    renderStats(getState('stats'));
    refreshCalendar();
    updateLoadMore();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ── Render Tasks ──────────────────────────
function renderTasks() {
  const list  = document.getElementById('task-list');
  const tasks = getState('tasks');
  if (!list) return;

  list.innerHTML = '';

  if (tasks.length === 0) {
    list.innerHTML = '<p class="col-span-2 text-center py-10 text-brand-gray font-actor">هیچ تسکی پیدا نشد</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  tasks.forEach((task) => {
    const card = createTaskCard(task, {
      onToggle: handleToggle,
      onEdit:   handleEdit,
      onDelete: handleDelete,
    });
    fragment.appendChild(card);
  });
  list.appendChild(fragment);
}

// ── Handlers ──────────────────────────────
async function handleToggle(id) {
  try {
    await API.toggleTask(id);
    loadTasks();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function handleEdit(id) {
  try {
    const task = await API.getTask(id);
    openModal(task);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function handleDelete(id) {
  if (!confirm('این تسک حذف بشه؟')) return;
  try {
    await API.deleteTask(id);
    showToast('تسک حذف شد');
    loadTasks();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ── Add Task ──────────────────────────────
function initAddTask() {
  const addBtn = document.getElementById('add-item');
  if (!addBtn) return;

  const getInputs = () => window.innerWidth < 768
    ? { title:  document.getElementById('title-task-mobile'),
        detail: document.getElementById('detail-task-mobile') }
    : { title:  document.getElementById('title-task'),
        detail: document.getElementById('detail-task') };

  addBtn.addEventListener('click', async () => {
    const { title: tEl, detail: dEl } = getInputs();
    const title  = tEl?.value.trim();
    const detail = dEl?.value.trim() ?? '';

    if (!title) { showToast('عنوان تسک رو وارد کن!', 'error'); return; }

    const filters    = getState('filters');
    const start_date = filters.date || new Date().toISOString().slice(0, 10);

    try {
      await API.createTask({ title, detail, start_date });
      showToast('تسک اضافه شد ✓');
      if (tEl) tEl.value = '';
      if (dEl) dEl.value = '';
      loadTasks();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  // Enter
  ['title-task', 'detail-task', 'title-task-mobile', 'detail-task-mobile'].forEach((id) => {
    document.getElementById(id)?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addBtn.click();
    });
  });
}

// ── Load More ─────────────────────────────
function initLoadMore() {
  document.getElementById('load-more')?.addEventListener('click', () => {
    const { offset, limit } = getState('pagination');
    setState('pagination', { offset: offset + limit });
    loadTasks(false);
  });
}

function updateLoadMore() {
  const btn = document.getElementById('load-more');
  if (btn) btn.classList.toggle('hidden', !getState('pagination').hasMore);
}