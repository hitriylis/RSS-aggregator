import onChange from 'on-change';
import * as yup from 'yup';
import { string } from 'yup';
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
  feeds: [],
  posts: [],
};

const watchedState = onChange(state, () => {
  render(state);
});

const postsSelection = (url) => {
  fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
    .then((response) => response.json())
    .then((data) => data.contents)
    .then((text) => parser(text))
    .then((doc) => {
      const feedsCount = state.feeds.length;
      let postsCount = feedsCount * 100;
      const feedTitle = doc.body.querySelector('title').textContent;
      const feedDescription = doc.body.querySelector('description').textContent;
      const feedId = feedsCount + 1;
      watchedState.feeds.push({ feedTitle, feedDescription, feedId });
      const posts = doc.querySelectorAll('item');
      posts.forEach((post) => {
        const postTitle = post.querySelector('title').textContent;
        const postDescription = post.querySelector('description').textContent;
        const linkElement = post.querySelector('link');
        const postLink = linkElement.nextSibling.textContent.trim();
        const postId = postsCount + 1;
        postsCount += 1;
        watchedState.posts.push({
          postTitle, postDescription, postLink, postId,
        });
      });
    })
    .catch(() => {
      watchedState.error = 'parseError';
    });
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
          state.urls.push(response);
          postsSelection(urlName);
        }
      })
      .catch((error) => {
        watchedState.error = error.message;
      });
  });
};

export default app;
