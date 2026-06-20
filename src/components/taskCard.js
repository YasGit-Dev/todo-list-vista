
const PRIORITY_COLOR = { high: '#C8A2A2', medium: '#A9B388', low: '#DBE2EF' };
const PRIORITY_LABEL = { high: 'بالا',    medium: 'متوسط',  low: 'پایین'  };

/**
 * یک کارت تسک میسازه از روی <template id="task-card-tpl">
 * @param {Object}   task
 * @param {Function} onToggle  (id) => void
 * @param {Function} onEdit    (id) => void
 * @param {Function} onDelete  (id) => void
 * @returns {HTMLElement}
 */
export function createTaskCard(task, { onToggle, onEdit, onDelete }) {
  const tpl  = document.getElementById('task-card-tpl');
  const card = tpl.content.cloneNode(true).firstElementChild;

  const isDone = task.status === 'done';
  if (isDone) {
    card.classList.add('opacity-60');
    card.querySelector('[data-field="title"]').classList.add('line-through');
  }

  card.dataset.id = task.id;
  card.querySelector('[data-field="title"]').textContent    = task.title;
  card.querySelector('[data-field="detail"]').textContent   = task.detail || '';
  card.querySelector('[data-field="date"]').textContent     = task.start_date;
  card.querySelector('[data-field="category"]').textContent = task.category;

  const priEl = card.querySelector('[data-field="priority"]');
  priEl.textContent              = PRIORITY_LABEL[task.priority] ?? task.priority;
  priEl.style.background         = PRIORITY_COLOR[task.priority] ?? '#DBE2EF';

  const toggleIcon = card.querySelector('[data-action="toggle"] i');
  toggleIcon.className = isDone
    ? 'ti ti-circle-check text-brand-green text-lg'
    : 'ti ti-circle text-brand-gray text-lg';

  const detailEl = card.querySelector('[data-field="detail"]');
  detailEl.hidden = !task.detail;

  card.querySelector('[data-action="toggle"]').addEventListener('click', () => onToggle(task.id));
  card.querySelector('[data-action="edit"]').addEventListener('click',   () => onEdit(task.id));
  card.querySelector('[data-action="delete"]').addEventListener('click', () => onDelete(task.id));

  return card;
}