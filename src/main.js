import './style.css'
import flatpickr from 'flatpickr';
import './flatpickr-custom.css';

const input = document.createElement('input');
input.type = 'text';
input.style.display = 'none';
document.getElementById('calendar-wrapper').appendChild(input);

flatpickr(input, {
  inline: true
});