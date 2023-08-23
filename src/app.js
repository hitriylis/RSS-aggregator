import onChange from 'on-change';
import axios from 'axios';
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

const urlSchema = (string().url().nullable());

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
      throw new Error('Unknown state!');
  }
});

const responseDocument = (url, doc, initialState) => {
  const feedTitle = doc.body.querySelector('title').textContent;
  const feedDescription = doc.body.querySelector('description').textContent;
  const posts = doc.querySelectorAll('item');
  const postsCount = posts.length;
  const feedUrl = url;

  if (!initialState.urls.includes(url)) {
    const feedsCount = initialState.feeds.length;
    const postsArea = feedsCount * 100;
    const feedId = postsArea;
    initialState.urls.push(url);
    watchedState.isValid = 'done';
    watchedState.feeds.push({
      feedTitle, feedDescription, feedId, feedUrl, postsCount,
    });
  }

  const findFeed = (obj) => (_.get(obj, 'feedUrl') === url);
  const currentFeed = initialState.feeds.find(findFeed);
  let postId = currentFeed.feedId;

  posts.forEach((post) => {
    const postTitle = post.querySelector('title').textContent;
    const postDescription = post.querySelector('description').textContent;
    const linkElement = post.querySelector('link');
    const postLink = linkElement.nextSibling.textContent.trim();
    watchedState.posts.unshift({
      postTitle, postDescription, postLink, postId,
    });
    postId += 1;
  });
};

const postsSelection = (url) => {
  axios({
    method: 'get',
    url: `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`,
    timeout: 10000,
  })
    .then((response) => response.data)
    .then((data) => data.contents)
    .then((text) => parser(text))
    .then((doc) => {
      responseDocument(url, doc, state);
    })
    .catch((error) => {
      switch (error.name) {
        case 'TypeError':
          state.error = 'validate.errors.invalidRss';
          watchedState.isValid = 'error';
          break;
        case 'AxiosError':
          state.error = 'validate.errors.networkError';
          watchedState.isValid = 'error';
          break;
        default:
          throw new Error('Error!');
      }
      console.log(error);
    });
};

let timerId = '';
const cycle = () => {
  clearTimeout(timerId);
  timerId = setTimeout(function innerFunc() {
    state.posts = [];
    state.feeds.forEach(({ feedUrl }) => {
      postsSelection(feedUrl);
    });
    timerId = setTimeout(innerFunc, 5000);
  }, 5000);
};

const app = () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const urlName = formData.get('url');

    if (!urlName) {
      state.error = 'validate.errors.emptyUrl';
      watchedState.isValid = 'error';
    } else {
      urlSchema.validate(urlName).then((response) => {
        if (state.urls.includes(response)) {
          state.error = 'validate.errors.existingUrl';
          watchedState.isValid = 'error';
        } else {
          state.error = '';
          watchedState.isValid = 'sending';
          postsSelection(urlName);
          cycle();
        }
      })
        .catch((error) => {
          state.error = error.message;
          watchedState.isValid = 'error';
        });
    }
  });

  const postsList = document.querySelector('.list-group');
  postsList.addEventListener('click', (e) => {
    const post = e.target.closest('.list-group-item');
    const button = post.querySelector('button');
    const link = button.previousSibling;
    if (e.target === button || e.target === link) {
      const watchedPostLink = link.getAttribute('href');
      const watchedPostId = button.getAttribute('data-id');
      const findPost = (obj) => (_.get(obj, 'postId') === Number(watchedPostId));
      watchedState.modalPost = state.posts.find(findPost);
      watchedState.uiState.watchedPosts.push(watchedPostLink);
    }
  });
};

export default app;
