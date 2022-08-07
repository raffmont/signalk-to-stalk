/*
52  01  XX  XX  Speed over Ground: XXXX/10 Knots
*/
// SeaTalk1 Encoder 0x52

const stalk = require('../stalk.js')
module.exports = function (app) {
  return {
    datagram: '0x52',
    title: '0x52 - Speed over Ground',
    keys: ['navigation.speedOverGround'],
    f: function g0x52 (sog) {
      var sogKn = sog*1.944
      var sog10 = parseInt(Math.round(sogKn*10))
      XXXX = stalk.padd(sog10.toString(16),4)
      return stalk.toDatagram(['52', '01', XXXX.substring(2,4), XXXX.substring(0,2)])
    }
  }
}
