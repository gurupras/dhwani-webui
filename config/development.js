module.exports = {
  backend: {
    /** @type {import('vite').ServerOptions} */
    server: {
      proxyPath: 'https://dhwani-backend.gurupras.me',
      port: 3132,
      hmr: {
        clientPort: 443
      }
    }
  }
}
