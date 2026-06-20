
import { getState, setState, resetPagination } from '../state.js';

/**
 * راه‌اندازی همه فیلترها
 * @param {Function} onFilterChange — callback که loadTasks رو صدا میزنه
 */
export function initFilters(onFilterChange) {
  initSelects(onFilterChange);
  initSearch(onFilterChange);
  initStatusBtns(onFilterChange);
  initClearDate(onFilterChange);
}


function initSelects(onChange) {
  document.getElementById('filter-category')?.addEventListener('change', (e) => {
    setState('filters', { category: e.target.value });
    resetPagination();
    onChange();
  });

  document.getElementById('filter-priority')?.addEventListener('change', (e) => {
    setState('filters', { priority: e.target.value });
    resetPagination();
    onChange();
  });
}


function initSearch(onChange) {
  let timer;
  document.getElementById('search-task')?.addEventListener('input', (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setState('filters', { search: e.target.value.trim() });
      resetPagination();
      onChange();
    }, 350);
  });
}


function initStatusBtns(onChange) {
  const btns = document.querySelectorAll('.status-btn');
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      setState('filters', { status: btn.dataset.s });
      resetPagination();

      btns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('border',          active);
        b.classList.toggle('border-brand-bg', active);
        b.classList.toggle('text-brand-bg',   active);
        b.classList.toggle('text-brand-gray', !active);
      });
      onChange();
    });
  });
}

function initClearDate(onChange) {
  document.getElementById('clear-date')?.addEventListener('click', () => {
    setState('filters', { date: '' });
    setState('calendar', getState('calendar'));
    getState('calendar')?.clear();
    resetPagination();
    toggleClearDateBtn(false);
    onChange();
  });
}

export function toggleClearDateBtn(show) {
  document.getElementById('clear-date')?.classList.toggle('hidden', !show);
}