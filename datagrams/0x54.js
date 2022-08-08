/*
54  T1  RS  HH  GMT-time:
                          HH hours, 6 MSBits of RST = minutes = (RS & 0xFC) / 4
                                    6 LSBits of RST = seconds =  ST & 0x3F
*/
// SeaTalk1 Encoder 0x54

const stalk = require('../stalk.js')
module.exports = function (app) {
  return {
    datagram: '0x54',
    title: '0x54 - GMT-time',
    keys: ['navigation.datetime'],
    f: function g0x54 (datetime8601) {
      var datetime = new Date(datetime8601)
      var HH = datetime.getUTCHours()
      
      var RS = ((datetime.getUTCMinutes() * 4) & 0xfc) + ((datetime.getUTCSeconds() >> 4) & 0x03)

      var T = datetime.getUTCSeconds() & 0x0f
      T = (T << 4) | 0x01

      return stalk.toDatagram(['54', stalk.toHexString(T), stalk.toHexString(RS),stalk.toHexString(HH)])
    }
  }
}
