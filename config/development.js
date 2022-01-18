module.exports = {
  backend: {
    /** @type {import('vite').ServerOptions} */
    server: {
      proxyPath: 'https://dhwani-backend.gurupras.me',
      port: 3132,
      hmr: {
        host: 'dhwani-backend.gurupras.me',
        protocol: 'wss',
        clientPort: 443
      }
    }
  }
}
