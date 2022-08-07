/*
53  U0  VW      Magnetic Course in degrees:
                  The two lower  bits of  U * 90 +
                  the six lower  bits of VW *  2 +
                  the two higher bits of  U /  2 =
                  (U & 0x3) * 90 + (VW & 0x3F) * 2 + (U & 0xC) / 8
                  The Magnetic Course may be offset by the Compass Variation (see datagram 99) to get the Course Over Ground (COG).
*/
// SeaTalk1 Encoder 0x53

const stalk = require('../stalk.js')
module.exports = function (app) {
  return {
    datagram: '0x53',
    title: '0x53 - Magnetic Couse in degrees',
    keys: ['navigation.courseOverGroundTrue','navigation.magneticVariation'],
    f: function g0x53 (cog,magneticVariation) {
      var mcd = parseInt(Math.round((cog-magneticVariation)*57.296))
      if (mcd>=360) mcd=mcd-360
      if (mcd<0) mcd=ncd+360
      var u1 = (mcd / 90.0) & 0x03
      var u2 = (stalk.fmod(mcd,2.0)*8.0) & 0x0c
      var vw = (stalk.fmod(mcd,90.0)/2.0) & 0x3f
      var u = ((u1+u2) << 4) & 0xf0
      return stalk.toDatagram(['53', stalk.toHexString(u), stalk.toHexString(vw)])
    }
  }
}
