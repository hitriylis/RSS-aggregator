import onChange from 'on-change';
import { string } from 'yup';
import render from './view';

const state = {
  currentUrl: '',
  validateError: '',
};

const urlSchema = (string().url().nullable());

const watchedState = onChange(state, () => {
  render(state);
});

const app = () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const urlName = formData.get('url');
    if (urlName === state.currentUrl) {
      watchedState.validateError = 'RSS уже существует';
      return;
    }
    const validateForm = urlSchema.validate(urlName);
    validateForm
      .then((response) => {
        watchedState.currentUrl = response;
        watchedState.validateError = '';
      })
      .catch(() => {
        watchedState.validateError = 'Ссылка должна быть валидным URL';
      });
  });
};

export default app;
