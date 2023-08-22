import onChange from 'on-change';
import * as yup from 'yup';
import { string } from 'yup';
import _ from 'lodash';
import render from './view';
import parser from './parser';

yup.setLocale({
  string: {
    url: () => 'validate.errors.invalidUrl',
  },
});

const urlSchema = (string().url());

const state = {
  urls: [],
  error: '',
  content: [],
};

let timerId = '';

const watchedState = onChange(state, () => {
  render(state);
});

const responseDocument = (url, doc, initialState) => {
  const feedTitle = doc.body.querySelector('title').textContent;
  const feedDescription = doc.body.querySelector('description').textContent;
  const posts = doc.querySelectorAll('item');
  const feedUrl = url;
  const feedPosts = [];

  if (!initialState.urls.includes(url)) {
    initialState.urls.push(url);
    watchedState.content.push({
      feedTitle, feedDescription, feedPosts, feedUrl,
    });
  }

  const findElement = (obj) => (_.get(obj, 'feedUrl') === url);

  const currentFeed = initialState.content.find(findElement);

  currentFeed.feedPosts = [];
  posts.forEach((post) => {
    const postTitle = post.querySelector('title').textContent;
    const postDescription = post.querySelector('description').textContent;
    const linkElement = post.querySelector('link');
    const postLink = linkElement.nextSibling.textContent.trim();
    currentFeed.feedPosts.push({
      postTitle, postDescription, postLink,
    });
    render(initialState);
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
      watchedState.error = 'parseError';
    });
};

const checkFeed = (url) => {
  fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
    .then((response) => response.json())
    .then((data) => data.contents)
    .then((text) => parser(text))
    .then((doc) => {
      const posts = doc.querySelectorAll('item');
      // const postsCount = posts.length;
      const findElement = (obj) => (_.get(obj, 'feedUrl') === url);
      const currentFeed = state.content.find(findElement);
      currentFeed.feedPosts = [];
      posts.forEach((post) => {
        const postTitle = post.querySelector('title').textContent;
        const postDescription = post.querySelector('description').textContent;
        const linkElement = post.querySelector('link');
        const postLink = linkElement.nextSibling.textContent.trim();
        currentFeed.feedPosts.push({
          postTitle, postDescription, postLink,
        });
        render(state);
      });
    })
    .catch((error) => console.log(error));
};

const app = () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const urlName = formData.get('url');
    urlSchema.validate(urlName)
      .then((response) => {
        if (state.urls.includes(response)) {
          watchedState.error = 'validate.errors.existingUrl';
        } else {
          state.error = '';
          postsSelection(urlName);
        }
      })
      .then(() => {
        clearTimeout(timerId);
        timerId = setTimeout(function innerFunc() {
          state.content.forEach(({ feedUrl }) => {
            checkFeed(feedUrl);
          });
          timerId = setTimeout(innerFunc, 5000);
        }, 5000);
      })
      .catch((error) => {
        watchedState.error = error.message;
      });
  });
};

export default app;
