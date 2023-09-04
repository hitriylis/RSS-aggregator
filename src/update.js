import _ from 'lodash';
import aggregator from './aggregator.js';

const update = (watchedState) => {
  watchedState.feed.forEach((URL) => aggregator(URL).then((result) => {
    const getCorrectFeed = (element) => element.link === URL;
    const correctFeed = watchedState.feedList.find(getCorrectFeed);
    const filteredItems = _.differenceBy(
      result.items,
      watchedState.feedListItems,
      'title',
    );
    const newItems = filteredItems.map((item) => ({
      ...item,
      feedID: correctFeed.id,
      postID: _.uniqueId(),
    }));
    watchedState.feedListItems.push(...newItems);
  }));
};
export default update;
