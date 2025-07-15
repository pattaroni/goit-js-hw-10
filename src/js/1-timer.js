import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import '@fortawesome/fontawesome-free/css/all.min.css';

let userSelectedDate = null;
let idTimer = null;
const inputDate = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const stopButton = document.querySelector('[data-stop]');
const seconds = document.querySelector('[data-seconds]');
const minutes = document.querySelector('[data-minutes');
const hours = document.querySelector('[data-hours');
const days = document.querySelector('[data-days');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const userCurrentTime = Date.now();
    if (userCurrentTime < selectedDates[0].getTime()) {
      userSelectedDate = selectedDates[0].getTime();
    }
    if (userSelectedDate <= userCurrentTime) {
      startButton.disabled = true;
      startButton.style.cursor = 'not-allowed';
      iziToast.error({
        message: 'Please choose a date in the future',
        backgroundColor: '#ff3b30',
        messageColor: '#ffffff',
        iconColor: '#ffffff',
        icon: 'fa fa-times-circle',
        position: 'topRight',
        timeout: 4000,
        close: false,
        progressBarColor: '#ffffff',
        onOpening: function (instance, toast) {
          const icon = toast.querySelector('.iziToast-icon');
          if (icon) {
            icon.style.cursor = 'pointer';
            icon.addEventListener('click', () => {
              iziToast.hide({}, toast);
            });
          }
        },
      });
    } else {
      startButton.disabled = false;
      startButton.style.cursor = 'pointer';
    }
  },
};
flatpickr('#datetime-picker', options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

startButton.addEventListener('click', () => {
  const timerUpdate = () => {
    const remainingTime = userSelectedDate - Date.now();
    const convertedTime = convertMs(remainingTime);
    if (remainingTime > 0) {
      seconds.textContent = convertedTime.seconds;
      minutes.textContent = convertedTime.minutes;
      hours.textContent = convertedTime.hours;
      days.textContent = convertedTime.days;
      startButton.disabled = true;
      startButton.style.cursor = 'not-allowed';
      inputDate.disabled = true;
      inputDate.style.cursor = 'not-allowed';
      addLeadingZero();
    } else {
      clearInterval(idTimer);
      startButton.disabled = false;
      startButton.style.cursor = 'pointer';
      inputDate.disabled = false;
      inputDate.style.cursor = 'pointer';
    }
  };

  idTimer = setInterval(timerUpdate, 1000);
});

const addLeadingZero = () => {
  [seconds, minutes, hours, days].forEach(item => {
    item.textContent = item.textContent.padStart(2, '0');
  });
};

stopButton.addEventListener('click', () => {
  clearInterval(idTimer);
  [seconds, minutes, hours, days].forEach(item => {
    item.textContent = '00';
  });
  startButton.disabled = false;
  startButton.style.cursor = 'pointer';
  inputDate.disabled = false;
  inputDate.style.cursor = 'pointer';
});
