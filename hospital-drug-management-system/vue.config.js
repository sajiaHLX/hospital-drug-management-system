module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'components': '@/components',
        'views': '@/views',
        'store': '@/store',
        'router': '@/router'
      }
    }
  }
}
