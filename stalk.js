const m_hex = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F'
]

function toDatagram (parts) {
  var base = "$STALK,"+parts.join(',')
  return base + computeChecksum(base)
}

function computeChecksum (datagram) {
  // skip the $
  let i = 1
  // init to first character
  let c1 = datagram.charCodeAt(i)
  // process rest of characters, zero delimited
  for (i = 2; i < datagram.length; ++i) {
    c1 = c1 ^ datagram.charCodeAt(i)
  }
  return '*' + toHexString(c1)
}

function toHexString (v) {
  let msn = (v >> 4) & 0x0f
  let lsn = (v >> 0) & 0x0f
  return m_hex[msn] + m_hex[lsn]
}

function padd (n, p, c) {
  let pad_char = typeof c !== 'undefined' ? c : '0'
  let pad = new Array(1 + p).join(pad_char)
  return (pad + n).slice(-pad.length)
}

module.exports = {
  toDatagram: toDatagram,
  radsToDeg: radsToDeg
}
