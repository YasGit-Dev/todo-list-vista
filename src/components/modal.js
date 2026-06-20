
import { getState, setState } from '../state.js';
import { updateTask }         from '../api.js';
import { showToast }          from './toast.js';

const modal = () => document.getElementById('edit-modal');
const field = (id) => document.getElementById(id);

export function initModal(onSaved) {
  field('close-modal')?.addEventListener('click', closeModal);
  field('save-task')?.addEventListener('click', () => handleSave(onSaved));


  modal()?.addEventListener('click', (e) => {
    if (e.target === modal()) closeModal();
  });

  // ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

export function openModal(task) {
  setState('editing', task.id);
  field('m-title').value    = task.title;
  field('m-detail').value   = task.detail    ?? '';
  field('m-category').value = task.category  ?? 'General';
  field('m-date').value     = task.start_date;
  field('m-priority').value = task.priority;
  field('m-status').value   = task.status;

  modal().classList.remove('hidden');
  modal().classList.add('flex');
  field('m-title').focus();
}

export function closeModal() {
  modal().classList.add('hidden');
  modal().classList.remove('flex');
  setState('editing', null);
}

async function handleSave(onSaved) {
  const id = getState('editing');
  if (!id) return;

  const payload = {
    title:      field('m-title').value.trim(),
    detail:     field('m-detail').value.trim(),
    category:   field('m-category').value.trim() || 'General',
    start_date: field('m-date').value,
    priority:   field('m-priority').value,
    status:     field('m-status').value,
  };

  if (!payload.title) { showToast('عنوان نمیتونه خالی باشه!', 'خطا'); return; }

  try {
    await updateTask(id, payload);
    showToast('تسک ویرایش شد ');
    closeModal();
    onSaved();
  } catch (err) {
    showToast(err.message, 'خطا');
  }
}