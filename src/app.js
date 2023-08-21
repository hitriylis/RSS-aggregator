import onChange from 'on-change';
import * as yup from 'yup';
import { string } from 'yup';
import render from './view';

yup.setLocale({
  string: {
    url: () => 'validate.errors.invalidUrl',
  },
});

const urlSchema = (string().url());

const state = {
  currentUrl: '',
  validateError: '',
};

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
      watchedState.validateError = 'validate.errors.existingUrl';
      return;
    }

    urlSchema.validate(urlName)
      .then((response) => {
        watchedState.currentUrl = response;
        watchedState.validateError = '';
      })
      .catch((error) => {
        watchedState.validateError = error.message;
      });
  });
};

export default app;
