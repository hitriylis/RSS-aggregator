import i18n from './init.js';

const render = (state) => {
  const form = document.querySelector('form');
  const input = document.querySelector('input');
  const paragraph = document.querySelector('.feedback');

  const { error } = state;
  if (error) {
    input.classList.add('is-invalid');
    paragraph.textContent = i18n.t(`${error}`);
    paragraph.classList.remove('text-success');
    paragraph.classList.add('text-danger');
  } else {
    const feedsContainer = document.querySelector('.feeds');
    const feedsTitle = feedsContainer.querySelector('.card-title');
    feedsTitle.textContent = 'Фиды';
    const feedsList = feedsContainer.querySelector('.list-group');
    feedsList.innerHTML = '';

    state.feeds.forEach(({ feedTitle, feedDescription }) => {
      const feed = document.createElement('li');
      feed.classList.add('list-group-item', 'border-0', 'border-end-0');
      const title = document.createElement('h6');
      const description = document.createElement('p');
      title.classList.add('m-0');
      title.textContent = feedTitle;
      description.classList.add('m-0', 'small', 'text-black-50');
      description.textContent = feedDescription;
      feed.append(title, description);
      feedsList.prepend(feed);
    });

    const postsContainer = document.querySelector('.posts');
    const postsTitle = postsContainer.querySelector('.card-title');
    postsTitle.textContent = 'Посты';
    const postsList = postsContainer.querySelector('.list-group');
    postsList.innerHTML = '';

    state.posts.forEach(({
      postTitle, postLink, postId,
    }) => {
      const post = document.createElement('li');
      post.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const link = document.createElement('a');
      const button = document.createElement('button');
      post.append(link, button);
      button.outerHTML = `<button type="button" class="btn btn-outline-primary btn-sm" data-id="${postId}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
      link.outerHTML = `<a href="${postLink}" class="fw-bold" data-id="${postId} target="_blank" rel="noopener noreferrer">${postTitle}</a>`;
      postsList.prepend(post);
    });

    paragraph.textContent = i18n.t('validate.loadSuccess');
    input.classList.remove('is-invalid');
    paragraph.classList.remove('text-danger');
    paragraph.classList.add('text-success');
    form.reset();
    input.focus();
  }
};

export default render;
