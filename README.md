# signalk-to-stalk
Signal K Node server plugin to convert Signal K to STALK (Seatalk over NMEA 0183). See the code for a list of supported datagra,s.

To use the plugin you need to activate the plugin and the relevant datagrams in server's Admin interface. This will make the conversion results (STALK) available on Signalk's built-in TCP NMEA 0183 server (Port 10110).

As the plugin automatically sends STALK data to Signalk's built-in TCP NMEA 0183 server, it is possible to have access to the NMEA 0183 strings without configuring anything (Aka a serial output device) by connecting to port 10110 with a TCP client.

If you want to output the conversion result into a serial connection (i.e. Digital Yacht's ST2USB or ST2NMEA0183 interfaces) you need to configure the serial connection in the server's Admin interface and add an extra line to the `settings.json`, specifying that the serial connection should output the plugin's output:


```
{
  "pipedProviders": [
    {
      "pipeElements": [
        {
          "type": "providers/simple",
          "options": {
            "logging": false,
            "type": "NMEA0183",
            "subOptions": {
              "validateChecksum": true,
              "type": "serial",
              "suppress0183event": true,
              "sentenceEvent": "stalkdata",
              "providerId": "a",
              "device": "/dev/ttyExample",
              "baudrate": 4800,
              "toStdout": "stalkout"          <------------ ADD THIS LINE
            },
            "providerId": "a"
          }
        }
      ],
      "id": "st2usb",
      "enabled": true
    }
  ],
  "interfaces": {}
}
```

Note: Internally the plugin emits the converted NMEA 0183 messages as `Events` under the event identifier `stalkout`. The above configuration sends the converted data (SeaTalk over NMEA 0183) under the `stalkout` events identifier to the serialport's output.

This Signal K server plugin has been developed from https://github.com/SignalK/signalk-to-nmea0183 and https://github.com/SignalK/signalk-autopilot excellent software components.
