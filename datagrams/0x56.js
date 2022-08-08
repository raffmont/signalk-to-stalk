/*
56  M1  DD  YY  Date: YY year, M month, DD day in month
*/
// SeaTalk1 Encoder 0x56

const stalk = require('../stalk.js')
module.exports = function (app) {
  return {
    datagram: '0x56',
    title: '0x56 - Date',
    keys: ['navigation.datetime'],
    f: function g0x56 (datetime8601) {
      var datetime = new Date(datetime8601)
      var YY = datetime.getUTCFullYear()-2000
      var DD = datetime.getUTCDate()
      var M = 0x01 | (((datetime.getUTCMonth() + 1) << 4) & 0xf0)

      return stalk.toDatagram(['56', stalk.toHexString(M), stalk.toHexString(DD),stalk.toHexString(YY)])
    }
  }
}
