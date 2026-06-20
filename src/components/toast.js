const DURATION = 2800;

/**
 * نمایش نوتیف
 * @param {string} msg
 * @param {'success'|'error'} type
 */
export function showToast(msg, type = 'success') {
  document.getElementById('toast')?.remove();

  const toast = document.createElement('div');
  toast.id    = 'toast';
  toast.setAttribute('role', 'alert');
  toast.className = [
    'fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]',
    'px-5 py-3 rounded-xl font-actor text-sm shadow-lg',
    'transition-all duration-300',
    type === 'error'
      ? 'bg-[#C8A2A2] text-[#3D3D3D]'
      : 'bg-brand-green text-white',
  ].join(' ');

  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), DURATION);
}