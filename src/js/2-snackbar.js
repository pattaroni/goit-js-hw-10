import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
form.addEventListener('submit', evt => {
  evt.preventDefault();

  const delay = form.elements.delay.value;
  let state = form.elements.state.value === 'fulfilled';
  makePromise({ delay, state })
    .then(() => {
      iziToast.success({
        message: `Fulfilled promise in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch(() => {
      iziToast.error({
        message: `Rejected promise in ${delay}ms`,
        position: 'topRight',
      });
    });
});

const makePromise = ({ delay, state }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state) {
        resolve();
      } else {
        reject();
      }
    }, delay);
  });
};
