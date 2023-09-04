const parser = new DOMParser();

const rssParser = (data, url) => {
  const parsed = parser.parseFromString(data.data.contents, 'application/xml');

  if (parsed.querySelector('parsererror')) {
    throw new Error('networkError');
  }
  const titleElement = parsed.querySelector('title');
  const feedTitle = titleElement.textContent;
  const descriptionElement = parsed.querySelector('description');
  const feedDescription = descriptionElement.textContent;
  const itemTags = parsed.querySelectorAll('item');
  const items = [...itemTags].map((item) => {
    const title = item.querySelector('title');
    const link = item.querySelector('link');
    const description = item.querySelector('description');
    return {
      title: title.innerHTML
        .trim()
        .replace(/^(\/\/\s*)?<!\[CDATA\[|(\/\/\s*)?\]\]>$/g, ''),
      link: link.innerHTML,
      description: description.innerHTML
        .trim()
        .replace(/^(\/\/\s*)?<!\[CDATA\[|(\/\/\s*)?\]\]>$/g, ''),
    };
  });

  return {
    title: feedTitle,
    description: feedDescription,
    link: url,
    items,
  };
};
export default rssParser;
