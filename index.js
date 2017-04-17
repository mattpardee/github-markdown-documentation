const github = require('./lib/github');
const Markdown = require('./lib/markdown');

module.exports = (options, cb) => {
  const accessToken = options.githubAccessToken;

  if (!accessToken) {
    return cb({
      status: 403,
      err: 'GitHub authorization required',
    });
  }

  if (!options.owner || !options.repo || !options.path) {
    return cb({
      status: 422,
      err: 'Please supply owner, repo and path in your request',
    });
  }

  github.authenticate({
    type: 'oauth',
    token: accessToken,
  });

  github.repos.getContent({
    owner: options.owner,
    repo: options.repo,
    path: options.path,
  })
  .then((result) => {
    const markdown = new Markdown();
    result.htmlContent = markdown.marked(
      github.utils.convertBase64ContentToUtf8(result.content),
      { renderer: markdown.renderer }
    );

    result.toc = markdown.toc;
    cb(null, result);
  })
  .catch(cb);
};
