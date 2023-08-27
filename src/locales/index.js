import i18n from 'i18next';
import en from './en.js';
import ru from './ru.js';
import elements from '../elements.js';

const newInstance = i18n.createInstance(
  {
    lng: 'ru',
    debug: true,
    resources: {
      en,
      ru,
    },
  },
  (err) => {
    console.log('something went wrong loading', err);
  },
);

const setLocales = () => {
  elements.getInterfaceLanguages().forEach((locale) => {
    const initialLocale = locale;
    initialLocale.textContent = newInstance.t(locale.dataset.i18n);
  });
};

export { newInstance, setLocales };
