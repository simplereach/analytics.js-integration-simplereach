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

  // append a tag to a open graph tag to detect
  var ogTag = document.createElement('meta');
  ogTag.property = 'article:sr_tag';
  ogTag.content = '$tag1';

  // append a date to a open graph tag to detect
  var ogDate = document.createElement('meta');
  ogDate.property = 'article:sr_published_at';
  ogDate.content = '2018-02-19';

  document.head.appendChild(el);
  document.head.appendChild(ogTag);
  document.head.appendChild(ogDate);
}());
