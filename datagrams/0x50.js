/*
50  Z2  XX  YY  YY  LAT position: XX degrees, (YYYY & 0x7FFF)/100 minutes
                     MSB of Y = YYYY & 0x8000 = South if set, North if cleared
                     Z= 0xA or 0x0 (reported for Raystar 120 GPS), meaning unknown
                     Stable filtered position, for raw data use command 58
                     Corresponding NMEA sentences: RMC, GAA, GLL
*/
// SeaTalk1 Encoder 0x50

const stalk = require('../stalk.js')
module.exports = function (app) {
  return {
    datagram: '0x50',
    title: '0x50 - LAT position',
    keys: ['navigation.position'],
    f: function g0x50 (position) {
      var latitude = Math.abs(position.latitude)
      var degrees = Math.floor(latitude)
      var minutes100 = parseInt(Math.round(100*(latitude-degrees)*60))
      XX = stalk.toHexString(parseInt(degrees))
      YYYY = minutes100 & 0x7FFF
      if (position.latitude<0) YYYY = YYYY | 0x8000
      YYYY = stalk.padd(YYYY.toString(16),4)
      return stalk.toDatagram(['50', 'A2', XX, YYYY.substring(0,2), YYYY.substring(2,4)])
    }
  }
}
