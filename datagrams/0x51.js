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
      XX = stalk.toHexString(parseInt(position.longitude))
      YYYY = parseInt(100*position.longitude-parseInt(position.longitude)) & 0x7FFF
      if (position.longitude>0) YYYY = YYYY | 0x8000
      YYYY = stalk.toHexString(YYYY)
      return stalk.toDatagram(['51', 'A2', XX, YYYY.substring(0,2), YYYY.substring(2)])
    }
  }
}
