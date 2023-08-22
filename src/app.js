import onChange from 'on-change';
import * as yup from 'yup';
import { string } from 'yup';
import _ from 'lodash';
import { render, handleProcessState } from './view';
import parser from './parser';

yup.setLocale({
  string: {
    url: () => 'validate.errors.invalidUrl',
  },
});

const urlSchema = (string().url());

const state = {
  urls: [],
  isValid: '',
  error: '',
  feeds: [],
  posts: [],
  uiState: {
    watchedPosts: [],
  },
  modalPost: '',
};

let timerId = '';

const watchedState = onChange(state, (path) => {
  switch (path) {
    case 'isValid':
      handleProcessState(state);
      break;
    case 'feeds':
      render(state, 'feeds');
      break;
    case 'posts':
      render(state, 'posts');
      break;
    case 'uiState.watchedPosts':
      render(state, 'posts');
      break;
    case 'modalPost':
      render(state, 'modalPost');
      break;
    default:
      break;
  }
});

const responseDocument = (url, doc, initialState) => {
  const feedTitle = doc.body.querySelector('title').textContent;
  const feedDescription = doc.body.querySelector('description').textContent;
  const posts = doc.querySelectorAll('item');
  const feedUrl = url;

  if (!initialState.urls.includes(url)) {
    const feedsCount = initialState.feeds.length;
    const postsCount = feedsCount * 100;
    const feedId = postsCount;
    initialState.urls.push(url);
    watchedState.isValid = 'done';
    watchedState.feeds.push({
      feedTitle, feedDescription, feedId, feedUrl,
    });
  }

  const findFeed = (obj) => (_.get(obj, 'feedUrl') === url);
  const currentFeed = initialState.feeds.find(findFeed);
  let postId = currentFeed.feedId;

  state.posts = [];

  posts.forEach((post) => {
    const postTitle = post.querySelector('title').textContent;
    const postDescription = post.querySelector('description').textContent;
    const linkElement = post.querySelector('link');
    const postLink = linkElement.nextSibling.textContent.trim();
    watchedState.posts.push({
      postTitle, postDescription, postLink, postId,
    });
    postId += 1;
  });
};

const postsSelection = (url) => {
  fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
    .then((response) => response.json())
    .then((data) => data.contents)
    .then((text) => parser(text))
    .then((doc) => {
      responseDocument(url, doc, state);
    })
    .catch(() => {
      state.error = 'parseError';
      watchedState.isValid = 'error';
    });
};

const app = () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const urlName = formData.get('url');
    urlSchema.validate(urlName).then((response) => {
      if (state.urls.includes(response)) {
        state.error = 'validate.errors.existingUrl';
        watchedState.isValid = 'error';
      } else {
        state.error = '';
        watchedState.isValid = 'sending';
        postsSelection(urlName);
        clearTimeout(timerId);
        timerId = setTimeout(function innerFunc() {
          state.feeds.forEach(({ feedUrl }) => {
            postsSelection(feedUrl);
          });
          timerId = setTimeout(innerFunc, 5000);
        }, 5000);
      }
    })
      .catch((error) => {
        state.error = error.message;
        watchedState.isValid = 'error';
      });
  });

  const postsList = document.querySelector('.list-group');
  postsList.addEventListener('click', (e) => {
    const button = e.target;
    const link = button.previousSibling;
    const watchedPostLink = link.getAttribute('href');
    const watchedPostId = button.getAttribute('data-id');
    const findPost = (obj) => (_.get(obj, 'postId') === Number(watchedPostId));
    watchedState.modalPost = state.posts.find(findPost);
    watchedState.uiState.watchedPosts.push(watchedPostLink);
  });
};

export default app;
