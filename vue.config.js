// see Vue CLI 4 deploy: https://cli.vuejs.org/guide/deployment.html#github-pages

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vcli4-todolist/'
    : '/'
}