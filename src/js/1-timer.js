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
const minutes = document.querySelector('[data-minutes]');
const hours = document.querySelector('[data-hours]');
const days = document.querySelector('[data-days]');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const userCurrentTime = Date.now();
    userSelectedDate = selectedDates[0].getTime();
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

if (userSelectedDate === null) {
  startButton.disabled = true;
  startButton.style.cursor = 'not-allowed';
}

startButton.addEventListener('click', () => {
  if (idTimer !== null) return;
  if (userSelectedDate < Date.now()) {
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
    });
    return;
  }
  const timerUpdate = () => {
    const remainingTime = userSelectedDate - Date.now();
    const convertedTime = convertMs(remainingTime);
    if (remainingTime > 0) {
      seconds.textContent = addLeadingZero(convertedTime.seconds);
      minutes.textContent = addLeadingZero(convertedTime.minutes);
      hours.textContent = addLeadingZero(convertedTime.hours);
      days.textContent = addLeadingZero(convertedTime.days);
      startButton.disabled = true;
      startButton.style.cursor = 'not-allowed';
      inputDate.disabled = true;
      inputDate.style.cursor = 'not-allowed';
    } else {
      clearInterval(idTimer);
      idTimer = null;
      startButton.disabled = false;
      startButton.style.cursor = 'pointer';
      inputDate.disabled = false;
      inputDate.style.cursor = 'pointer';
    }
  };

  idTimer = setInterval(timerUpdate, 1000);
});

const addLeadingZero = value => {
  return value.toString().padStart(2, '0');
};

stopButton.addEventListener('click', () => {
  clearInterval(idTimer);
  idTimer = null;
  [seconds, minutes, hours, days].forEach(item => {
    item.textContent = '00';
  });
  if (userSelectedDate > Date.now()) {
    startButton.disabled = false;
    startButton.style.cursor = 'pointer';
  }
  inputDate.disabled = false;
  inputDate.style.cursor = 'pointer';
});
