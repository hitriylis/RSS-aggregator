import i18next from 'i18next';
import resources from './locales/ru.js';

const i18n = i18next.createInstance();
i18n.init({
  lng: 'ru',
  debug: false,
  resources,
});

export default i18n;
