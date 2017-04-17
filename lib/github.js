const GitHubApi = require('github');

const github = new GitHubApi({});

github.utils = {
  convertBase64ContentToUtf8(content) {
    return Buffer.from(content, 'base64').toString('utf8');
  },
};

module.exports = github;
