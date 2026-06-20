// ─────────────────────────────────────────
// src/modules/calendar.js
// ─────────────────────────────────────────

import flatpickr                  from 'flatpickr';
import { setState, getState }     from '../state.js';
import { resetPagination }        from '../state.js';
import { toggleClearDateBtn }     from './filters.js';

const fmt = (d) =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

/** راه‌اندازی تقویم */
export function initCalendar(onDateChange) {
  const wrapper = document.getElementById('calendar-wrapper');
  if (!wrapper) return;

  // input مخفی که flatpickr روش میشینه
  const input = Object.assign(document.createElement('input'), {
    type: 'text',
  });
  input.style.display = 'none';
  wrapper.appendChild(input);

  const fp = flatpickr(input, {
    inline:      true,
    dateFormat:  'Y-m-d',
    onDayCreate: (_dObj, _dStr, _fp, dayElem) => markTaskDay(dayElem),
    onChange:    ([date]) => {
      if (!date) return;
      const formatted = fmt(date);
      setState('filters', { date: formatted });
      resetPagination();
      toggleClearDateBtn(true);
      onDateChange();
    },
  });

  setState('calendar', fp);
  injectCalendarStyles();
}

/** هایلایت روزهایی که تسک دارن */
function markTaskDay(dayElem) {
  const dateStr   = fmt(dayElem.dateObj);
  const taskDates = getState('taskDates');
  if (taskDates.includes(dateStr)) {
    dayElem.classList.add('has-task');
    dayElem.title = 'دارای تسک';
  }
}

/** بعد از لود تسک‌ها تقویم رو redraw کن */
export function refreshCalendar() {
  getState('calendar')?.redraw?.();
}

function injectCalendarStyles() {
  if (document.getElementById('fp-custom-styles')) return;
  const style = document.createElement('style');
  style.id    = 'fp-custom-styles';
  style.textContent = `
    .flatpickr-calendar.inline { width:100%!important; background:transparent; box-shadow:none; border:none; }
    .flatpickr-day.selected,
    .flatpickr-day.selected:hover          { background:#A9B388; border-color:#A9B388; }
    .flatpickr-day.has-task                { border-bottom:2px solid #C8A2A2; font-weight:bold; }
    .flatpickr-day.has-task.selected       { border-bottom:2px solid white; }
    .flatpickr-months .flatpickr-month,
    .flatpickr-current-month .cur-month,
    .flatpickr-current-month input.cur-year { color:#3D3D3D; }
    .flatpickr-weekday                     { color:#7C7C7C; }
  `;
  document.head.appendChild(style);
}