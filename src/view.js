import { newInstance, setLocales } from './locales/index.js';
import { renderRSSFeed, renderRSSPosts } from './render.js';
import elements from './elements.js';

const langMap = { ru: 'ru', eng: 'en' };

const render = (path, value, watchedState) => {
  switch (path) {
    case 'errors':
      elements.input.classList.add('is-invalid');
      elements.errorMessage.classList.remove('text-success');
      elements.errorMessage.classList.add('text-danger');
      elements.errorMessage.textContent = value.message;
      break;
    case 'state':
      if (value === 'valid') {
        elements.formReset.reset();
        elements.input.focus();
        elements.input.classList.remove('is-invalid');
        elements.errorMessage.classList.remove('text-danger');
        elements.errorMessage.classList.add('text-success');
        elements.errorMessage.setAttribute('data-i18n', 'success');
        elements.errorMessage.textContent = newInstance.t('success');
      }
      break;
    case 'lng':
      newInstance.changeLanguage(langMap[value]).then(() => setLocales());
      break;
    case 'feedList':
      renderRSSFeed(watchedState.feedList);
      break;
    case 'feedListItems':
    case 'openPost':
      renderRSSPosts(watchedState);
      break;
    case 'modalWindow': {
      const { title, link, description } = watchedState.modalWindow;
      const modalTitle = elements.modal.querySelector('.modal-title');
      const modalBody = elements.modal.querySelector('.modal-body');
      const modalFooter = elements.modal.querySelector('.modal-footer');
      const modalFooterLink = modalFooter.querySelector('a');
      modalFooterLink.setAttribute('href', link);
      modalTitle.textContent = title;
      modalBody.textContent = description;
      break;
    }
    case 'status':
      if (value === 'pending') {
        elements.sumbitButton.setAttribute('disabled', true);
      } else {
        elements.sumbitButton.removeAttribute('disabled');
      }
      break;
    default:
      break;
  }
};

export default render;
