import { newInstance } from './locales/index.js';
import elements from './elements.js';

const renderRSSFeed = (state) => {
  elements.feedList.innerHTML = '';
  const div = document.createElement('div');
  div.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.setAttribute('data-i18n', 'feedTitle');
  h2.textContent = newInstance.t('feedTitle');
  div.append(h2);
  elements.feedList.append(div);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  state.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.setAttribute('data-id', feed.id);
    h3.textContent = feed.title;
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;
    li.append(h3, p);
    ul.prepend(li);
    elements.feedList.append(ul);
  });
};

const renderRSSPosts = ({ feedListItems: state, openPost }) => {
  elements.contentList.innerHTML = '';

  const div2 = document.createElement('div');
  div2.classList.add('card-body');
  const h2Posts = document.createElement('h2');
  h2Posts.classList.add('card-title', 'h4');
  h2Posts.setAttribute('data-i18n', 'postsTitle');
  h2Posts.textContent = newInstance.t('postsTitle');
  div2.append(h2Posts);
  elements.contentList.append(div2);
  const ul2 = document.createElement('ul');
  ul2.classList.add('list-group', 'border-0', 'rounded-0');

  state.forEach((item) => {
    const li2 = document.createElement('li');
    li2.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    li2.setAttribute('data-postId', item.postID);

    const a = document.createElement('a');
    a.setAttribute('href', item.link);
    a.classList.add(openPost.includes(item.postID) ? 'fw-normal' : 'fw-bold');
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = item.title;
    li2.append(a);
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.setAttribute('data-i18n', 'postButton');
    button.setAttribute('data-bs-title', item.title);
    button.setAttribute('data-bs-link', item.link);
    button.setAttribute('data-bs-description', item.description);
    button.textContent = newInstance.t('postButton');
    li2.append(button);
    ul2.prepend(li2);
    elements.contentList.append(ul2);
  });
};

export { renderRSSFeed, renderRSSPosts };
