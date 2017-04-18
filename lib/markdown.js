const marked = require('marked');
const striptags = require('striptags');
const _ = require('lodash');
const hljs = require('highlight.js');

// TODO: Use something standard to remove any non-URL characters
function normalizeTocLink(text) {
  return _.unescape(text).toLowerCase().match(/[a-zA-Z0-9-_]+/g).join('-');
}

marked.setOptions({
  highlight(code) {
    return hljs.highlightAuto(code).value;
  },
});

function Markdown() {
  const renderer = new marked.Renderer();
  const toc = [];

  renderer.code = (code, language) =>
    `<pre><code class="hljs ${language}">${hljs.highlightAuto(code).value}</code></pre>`;

  renderer.heading = (text, level) => {
    const strippedTagsText = striptags(text);
    const normalizedLink = normalizeTocLink(strippedTagsText);

    toc.push({
      level,
      link: normalizedLink,
      text: strippedTagsText,
    });

    return `<a id="${normalizedLink}" name="${normalizedLink}" 
      href="#${normalizedLink}"></a><h${level}>${text}</h${level}>`;
  };

  renderer.link = function link(href, title, text) {
    return `<a href="${href}" title="${title}"
      ${(href[0] === '#' ? '' : ' target="_blank"')}>${text}</a>`;
  };

  return { marked, renderer, toc };
}

module.exports = Markdown;
