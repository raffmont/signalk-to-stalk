/*
51  Z2  XX  YY  YY  LON position: XX degrees, (YYYY & 0x7FFF)/100 minutes
                                  MSB of Y = YYYY & 0x8000 = East if set, West if cleared
                                  Z= 0xA or 0x0 (reported for Raystar 120 GPS), meaning unknown
                                  Stable filtered position, for raw data use command 58
                                  Corresponding NMEA sentences: RMC, GAA, GLL
*/
// SeaTalk1 Encoder 0x51

const stalk = require('../stalk.js')
module.exports = function (app) {
  return {
    datagram: '0x51',
    title: '0x51 - LON position',
    keys: ['navigation.position'],
    f: function g0x51 (position) {
      var longitude = Math.abs(position.longitude)
      var degrees = Math.floor(longitude)
      var minutes100 = parseInt(Math.round(100*(longitude-degrees)*60))
      XX = stalk.toHexString(parseInt(degrees))
      YYYY = minutes100 & 0x7FFF
      if (position.longitude>0) YYYY = YYYY | 0x8000
      YYYY = stalk.padd(YYYY.toString(16),4)
      return stalk.toDatagram(['51', 'A2', XX, YYYY.substring(2,4), YYYY.substring(0,2)])
    }
  }
}
