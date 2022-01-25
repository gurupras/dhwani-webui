export default class DhwaniBackend {
  /**
   *
   * @param {WebSocket} ws
   */
  constructor (ws) {
    this.ws = ws
  }

  /**
   * Assign the native backend an ID
   * @param {String} id
   */
  setID (id) {
    this.ws.send(JSON.stringify({
      action: 'set-id',
      data: id
    }))
  }

  _requestResponse (req, responseEvent) {
    const { ws } = this
    const promise = new Promise(resolve => {
      ws.addEventListener('message', function once (msg) {
        const json = JSON.parse(msg.data)
        const { action, data } = json
        if (action !== responseEvent) {
          return
        }
        ws.removeEventListener('message', once)
        resolve(data)
      })
    })
    ws.send(JSON.stringify(req))
    return promise
  }

  startRTPServer () {
    return this._requestResponse({
      action: 'start-rtp-server'
    }, 'started-rtp-server')
  }

  startAudioStream (deviceID) {
    return this._requestResponse({
      action: 'start-audio-stream',
      data: deviceID
    }, 'started-audio-stream')
  }

  getDevices () {
    return this._requestResponse({
      action: 'get-devices'
    }, 'get-devices-response')
  }
}
