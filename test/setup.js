/* eslint strict: ['error', 'function'] */
(function() {
  'use strict';

  // If title === '', Simplereach uses document.href by default
  document.title = 'Simplereach Testing';

  // HACK(ndhoule): Tests are flaky and rely on a canonical URL being present on
  // the page
  var el = document.createElement('link');
  el.rel = 'canonical';
  el.href = 'http://mygreatreachtestsite.com/ogurl.html';

  // append two tags to an open graph tag to detect
  var ogTag = document.createElement('meta');
  ogTag.setAttribute('property', 'article:sr_tag');
  ogTag.setAttribute('content', '$tag1');

  var ogTagTwo = document.createElement('meta');
  ogTagTwo.setAttribute('property', 'article:sr_tag');
  ogTagTwo.setAttribute('content', '$tag2');

  // append a date to an open graph tag to detect
  var ogDate = document.createElement('meta');
  ogDate.setAttribute('property', 'article:sr_published_at');
  ogDate.setAttribute('content', '2018-02-19');

  // append an author to an sr open graph tag to detect
  var ogAuthor = document.createElement('meta');
  ogAuthor.setAttribute('property', 'article:sr_author');
  ogAuthor.setAttribute('content', 'Henry David Thoreau');

  // append a channel to an sr open graph tag to detect
  var ogChannel = document.createElement('meta');
  ogChannel.setAttribute('property', 'article:sr_section');
  ogChannel.setAttribute('content', 'nickelodeon');

  document.head.appendChild(el);
  document.head.appendChild(ogTag);
  document.head.appendChild(ogTagTwo);
  document.head.appendChild(ogDate);
  document.head.appendChild(ogAuthor);
  document.head.appendChild(ogChannel);
}());
