const Bacon = require('baconjs')
const {
  toSentence,
  computeChecksum,
  toHexString,
  radsToDeg,
  padd,
  toNmeaDegrees
} = require('./stalk')
const path = require('path')
const fs = require('fs')

module.exports = function (app) {
  var plugin = {
    unsubscribes: []
  }

  plugin.id = 'sk-to-stalk'
  plugin.name = 'Convert Signal K to STALK'
  plugin.description = 'Plugin to convert Signal K to STALK (SeaTalk over NMEA0183)'

  plugin.schema = {
    type: 'object',
    title: 'Conversions to STALK',
    description:
      'If there is SK data for the conversion generate the following SeaTalk datagrams from Signal K data:',
    properties: {}
  }

  plugin.start = function (options) {
    const selfContext = 'vessels.' + app.selfId
    const selfMatcher = delta => delta.context && delta.context === selfContext

    function mapToStalk (encoder, throttle) {
      const selfStreams = encoder.keys.map((key, index) => {
        let stream = app.streambundle.getSelfStream(key)
        if (encoder.defaults && typeof encoder.defaults[index] != 'undefined') {
          stream = stream.merge(Bacon.once(encoder.defaults[index]))
        }
        return stream
      }, app.streambundle)
      const sentenceEvent = encoder.sentence ? `g${encoder.sentence}` : undefined

      let stream = Bacon.combineWith(function () {
        try {
          return encoder.f.apply(this, arguments)
        } catch (e) {
          console.error(e.message)
        }
      }, selfStreams)
        .filter(v => typeof v !== 'undefined')
        .changes()
        .debounceImmediate(20)

      if (throttle) {
        stream = stream.throttle(throttle)
      }

      plugin.unsubscribes.push(
        stream
          .onValue(nmeaString => {
            app.emit('stalkout', nmeaString)
            if (sentenceEvent) {
              app.emit(sentenceEvent, nmeaString)
            }
            app.debug(nmeaString)
          })
      )
    }

    Object.keys(plugin.datagrams).forEach(name => {
      if (options[name]) {
        mapToStalk(plugin.datagrams[name], options[getThrottlePropname(name)])
      }
    })
  }

  plugin.stop = function () {
    plugin.unsubscribes.forEach(f => f())
  }

  plugin.datagrams = loadDatagrams(app, plugin)
  buildSchemaFromDatagrams(plugin)
  return plugin
}

function buildSchemaFromDatagrams (plugin) {
  Object.keys(plugin.datagrams).forEach(key => {
    var datagram = plugin.datagrams[key]
    const throttlePropname = getThrottlePropname(key)
    plugin.schema.properties[key] = {
      title: datagram['title'],
      type: 'boolean',
      default: false
    }
    plugin.schema.properties[throttlePropname] = {
      title: `${key} throttle ms`,
      type: 'number',
      default: 0
    }
  })
}

function loadDatagrams (app, plugin) {
  const fpath = path.join(__dirname, 'datagrams')
  return fs
    .readdirSync(fpath)
    .filter(filename => filename.endsWith('.js'))
    .reduce((acc, fname) => {
      let datagram = path.basename(fname, '.js')
      acc[datagram] = require(path.join(fpath, datagram))(app, plugin)
      return acc
    }, {})
}

const getThrottlePropname = (key) => `${key}_throttle`
