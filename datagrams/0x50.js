/*
50  Z2  XX  YY  YY  LAT position: XX degrees, (YYYY & 0x7FFF)/100 minutes
                     MSB of Y = YYYY & 0x8000 = South if set, North if cleared
                     Z= 0xA or 0x0 (reported for Raystar 120 GPS), meaning unknown
                     Stable filtered position, for raw data use command 58
                     Corresponding NMEA sentences: RMC, GAA, GLL
*/
// SeaTalk1 Encoder 0x50

const nmea = require('../stalk.js')
module.exports = function (app) {
  return {
    datagram: '0x50',
    title: '0x50 - LAT position',
    keys: ['navigation.position'],
    f: function f_0x50 (position) {
      XX = stalk.toHexString(parseInt(position.latitude))
      YYYY = parseInt(100*position.latitude-parseInt(position.latitude)) & 0x7FFF
      if (position.latitude<0) YYYY = YYYY | 0x8000
      YYYY = stalk.toHexString(YYYY)
      return stalk.toDatagram(['50', 'A2', XX, YYYY.substring(0,2), YYYY.substring(2)])
    }
  }
}
